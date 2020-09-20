import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import firebase from '../../firebase';

import './new.css';

class New extends Component {
  constructor(props) {
    super(props);

    this.state = {
      titulo: '',
      imagem: null,
      url: '',
      descricao: '',
      alert: '',
      progress: 0,
    };
  }

  componentDidMount() {
    if (!firebase.getCurrent()) {
      this.props.history.replace('/');
      return null;
    }
  }

  handleTitulo = (event) => {
    const titulo = event.target.value;
    this.setState({ titulo });
  };

  handleImagem = async (event) => {
    if (event.target.files[0]) {
      const imagem = event.target.files[0];

      if (imagem.type === 'image/png' || imagem.type === 'image/jpeg') {
        await this.setState({ imagem: imagem });
        this.handleUpload();
      } else {
        alert('Envie uma imagem do tipo PNG ou JPG');
        this.setState({ imagem: null });
        return null;
      }
    }
  };

  handleUpload = async () => {
    const { imagem } = this.state;
    const currentUid = firebase.getCurrentUid();

    const uploadTaks = firebase.storage
      .ref(`imagens/${currentUid}/${imagem.name}`)
      .put(imagem);

    await uploadTaks.on(
      'state_changed',
      (snapshot) => {
        //progress
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        this.setState({ progress });
      },
      (error) => {
        console.log('Erro imagem: ' + error);
      },
      () => {
        //sucesso
        firebase.storage
          .ref(`imagens/${currentUid}`)
          .child(imagem.name)
          .getDownloadURL()
          .then((url) => {
            this.setState({ url:url });
          });
      }
    );
  };

  handleDescricao = (event) => {
    const descricao = event.target.value;
    this.setState({ descricao });
  };

  handleCadastro = async (event) => {
    const { titulo, imagem, descricao, url } = this.state;
    event.preventDefault();

    if (
      titulo !== '' &&
      imagem !== '' &&
      descricao !== '' &&
      imagem !== null &&
      url !== ''
    ) {
      const { titulo, imagem, descricao } = this.state;
      const posts = firebase.app.ref('posts');
      const chave = posts.push().key;

      await posts.child(chave).set({
        titulo,
        imagem: this.state.url,
        descricao,
        autor: localStorage.nome,
      });

      this.props.history.push('/dashboard');
    } else {
      this.setState({ alert: 'Preencha todos os campos!' });
    }
  };

  render() {
    const { titulo, descricao, alert } = this.state;
    return (
      <div>
        <header id="new">
          <Link to="/dashboard">Voltar</Link>
        </header>

        <span id="alert">{alert}</span>

        <form onSubmit={this.handleCadastro} id="new-post">
          <input type="file" onChange={this.handleImagem} />
          <br />
          {this.state.url !== '' ? (
            <img src={this.state.url} alt={'Capa ' + titulo} />
          ) : (
            <progress value={this.state.progress} max="100" />
          )}

          <label>Título</label>
          <input
            type="text"
            placeholder="Nome do post"
            value={titulo}
            onChange={this.handleTitulo}
            autoFocus
          />
          <label>Descrição</label>
          <textarea
            type="text"
            placeholder="Descrição do seu post"
            value={descricao}
            onChange={this.handleDescricao}
          />
          <button type="submit">Cadastrar</button>
        </form>
      </div>
    );
  }
}

export default withRouter(New);

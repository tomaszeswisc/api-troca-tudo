CREATE DATABASE troca_tudo;

USE troca_tudo;

-- Tabela de Usuários
CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100),
    avatar VARCHAR(255),
    email VARCHAR(100) UNIQUE,
    senha VARCHAR(255), -- senha criptografada
    curtidas_totais INT DEFAULT 0,
    descurtidas_totais INT DEFAULT 0
);

-- Tabela de Produtos
CREATE TABLE produtos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100),
    imagem VARCHAR(255),
    curtidas INT DEFAULT 0,
    descurtidas INT DEFAULT 0
);

-- Tabela de Curtidas/Descurtidas
CREATE TABLE curtidas_descurtidas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT,
    id_produto INT,
    tipo ENUM('curtida', 'descurtida'),
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id),
    FOREIGN KEY (id_produto) REFERENCES produtos(id)
);

-- Tabela de Comentários
CREATE TABLE comentarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_produto INT,
    id_usuario INT,
    comentario TEXT,
    cidade VARCHAR(100),
    estado VARCHAR(100),
    FOREIGN KEY (id_produto) REFERENCES produtos(id),
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id)
);
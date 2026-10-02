# Sangue Bom 🩸

Sistema de gerenciamento de doações de sangue, pensado como parte do próprio Hemocentro de Juiz de Fora. A plataforma conecta o Hemocentro, os doadores e os hospitais/clínicas, ajudando a manter o estoque de sangue sob controle.

Projeto acadêmico desenvolvido na disciplina de Linguagem de Programação II (Instituto Federal do Sudeste de Minas Gerais, Campus Juiz de Fora).

## Sobre o projeto

Hoje, o controle de estoque, a convocação de doadores e o atendimento de pedidos de hospitais e clínicas dependem de processos pouco integrados. O Sangue Bom propõe um único sistema para:

- convocar doadores compatíveis quando o estoque de um tipo sanguíneo está em alerta ou crítico;
- acompanhar o histórico de doações e a data da próxima doação habilitada;
- receber e responder pedidos de sangue de hospitais e clínicas;
- dar ao Hemocentro uma visão clara dos níveis de estoque por tipo sanguíneo.

## Perfis de usuário

- **Doador:** cadastro, histórico de doações, pedidos compatíveis com seu tipo sanguíneo e gerenciamento do próprio perfil.
- **Hemocentro:** controle de estoque, criação de convocações, registro de doações realizadas e análise de pedidos de hospitais e clínicas.
- **Hospital/Clínica:** cadastro institucional, solicitação de sangue e acompanhamento do histórico de pedidos.
- **Administrador:** gestão geral dos usuários e correção de dados cadastrais.

## Tecnologias

- React (projeto iniciado com Create React App)
- json-server, como back-end simulado durante esta etapa do projeto
- Figma, para o protótipo das telas

## Como executar

Pré-requisito: ter o Node.js instalado.

1. Clone este repositório e entre na pasta do projeto.
2. Instale as dependências com `npm install`.
3. Inicie o projeto com `npm start`. O navegador abre automaticamente e a página recarrega sozinha a cada alteração.

Outros scripts disponíveis:

- `npm test`: executa os testes em modo interativo.
- `npm run build`: gera a versão otimizada para produção na pasta `build`.

## Status

Em desenvolvimento. Nesta etapa o foco é o front-end, usando um back-end simulado. O banco de dados real será desenvolvido em um próximo semestre.

## Equipe

- [Thays Sabino](https://github.com/thays-sabino)
- [Sophia Marques](https://github.com/Sophia-Marques16)

## Contexto acadêmico

Projeto desenvolvido para fins educacionais. Os dados utilizados são fictícios.

---

Este projeto foi iniciado com [Create React App](https://github.com/facebook/create-react-app).

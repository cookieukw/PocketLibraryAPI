# PocketLibrary API - README

## Sobre a API

Esta é uma API não oficial que realiza scraping no site [Domínio Público](http://www.dominiopublico.gov.br/pesquisa/PesquisaObraForm.jsp) para fornecer acesso a uma vasta coleção de livros, teses, TCCs e mais, todos em domínio público. A API foi desenvolvida para promover a leitura e facilitar o acesso a obras disponíveis gratuitamente na internet. Ela permite pesquisar e obter informações sobre os livros disponíveis no Domínio Público de forma rápida e fácil.

## História da API

A API foi desenvolvida como parte de um projeto acadêmico em 2022, com o objetivo de abordar o problema da disponibilidade de livros em uma biblioteca inativa devido à falta de um bibliotecário dedicado. A ideia surgiu da necessidade de resolver eficientemente um problema específico dentro do escopo do projeto. O desenvolvedor identificou a oportunidade de criar um aplicativo de eBooks para promover a leitura e resolver, pelo menos parcialmente, o problema da disponibilidade de livros.

O protótipo, inicialmente, era offline e carregava os dados dos livros a partir de um JSON armazenado nos ativos do aplicativo. Posteriormente, em uma versão atualizada, utilizava o Firebase como banco de dados para poder adicionar e gerenciar o conteúdo dos livros de forma manual.

Durante a pesquisa, o desenvolvedor descobriu o site Domínio Público, que oferece uma ampla variedade de obras em domínio público. Ele decidiu utilizar esse recurso como fonte de dados para o aplicativo, desenvolvendo scripts para baixar os livros e armazenando as informações em um banco de dados. O projeto foi aprovado e resultou em um aplicativo com cerca de 2 mil livros.

No ano seguinte, em 2023, o desenvolvedor decidiu dar continuidade ao projeto, desenvolvendo esta API não oficial. A API realiza scraping no site do Domínio Público, evitando a necessidade de armazenamento de dados, manipulação manual e proporcionando acesso rápido às informações sobre os livros disponíveis.

## Uso da API

### Rotas e Métodos

#### Obter lista de livros/pesquisa

- **Método:** GET
- **Rota:** `/api/books`

Obtém uma lista de livros disponíveis no Domínio Público.

- **Método:** GET
- **Rota:** `/api/books?<parâmetro>=<valor>&<outro_parâmetro>=<outro_valor>`

Realiza uma pesquisa de livros com base nos parâmetros especificados.

**Exemplo de retorno de dados:**

```json
[
{
"title": "Avaliação da reação em...",
"author": "Danielle Bastos Araujo",
"font": "Programas de Pós-graduação da CAPES",
"id": "83513",
"size": "407,36 KB",
"sizeByBytes": 417136,
"format": ".pdf"
},
...
]
```

#### Obter informações sobre um livro específico

- **Método:** GET
- **Rota:** `/api/book/<ID_LIVRO>`

Obtém informações detalhadas sobre um livro específico com base no ID do livro fornecido.

**Exemplo de retorno de dados:**

```json
{
"downloadUrl": "informação indisponível",
"title": "título aqui",
"author": "Danielle Bastos Araujo",
"category": "teses e dissertações",
"language": "português",
"intitutionOrPartner": "...",
"institutionOrProgram": "...",
"knowledgeArea": "MEDICINA VETERINÁRIA",
"level": "Mestrado",
"thesisYear": "2007",
"acesses": "4.964",
"absctract": "..."
}
```

>[!WARNING]
> Alguns livros podem não ter todas essas informações. Em teoria, a API deve exibir esses dados sempre que eles forem apresentados ao acessar o site original

#### Headers para acesso à URL de download

Se você quiser acessar a URL de download sem problemas, passe alguns headers no request da URL.
 ```js
 const options = {   
   headers: {   
     'User-Agent': '<user_agent>',   
     "Cookie":"JSESSIONID=<uma_id_aleatoria>",  
     'Accept': '/',  
     'Connection': 'keep-alive'  
   }   
 };  
 ``` 
### Parâmetros de Pesquisa

A API suporta diversos parâmetros de pesquisa para refinar os resultados:

| Parâmetro | Descrição | Valor padrão | Tipo |
|-|-|-|-|
| `artwork` | Pesquisa pelo código da obra a ser pesquisada.| null | number |
| `authorName` | Pesquisa pelo nome do autor.| null | number |
| `category` | Define a categoria da obras a serem pesquisadas. Consulte a tabela de categorias abaixo para os números correspondentes.| null | number |
| `codeAuthor` | Pesquisa pelo código do autor.| null | number |
| `filterBy` | Define a coluna na base de dados para ordenação dos resultados da pesquisa. Consulte a tabela abaixo sobre este atributo para conferir os parâmetros | null | string|
| `itemsSize` | Define a quantidade de itens a serem retornados na pesquisa.| 10| number |
| `language` | Define o idioma das obras a serem pesquisadas . Consulte a tabela de idiomas abaixo para os números correspondentes. | 1(Português) | number |
| `media` | Define o tipo de mídia a ser pesquisada (Texto , imagem, som, vídeo). Consulte a tabela de tipos de mídia abaixo para os números correspondentes.| 2(Texto )| number |
| `order` | Determina a direção da ordenação dos resultados da pesquisa (ascendente ou descendente).| null | string(ASC ou DESC) |
| `page` | Define a página da pesquisa de resultados a ser exibida.| 2 | number |
| `skipItems` | Permite pular uma quantidade específica de itens no resultado da pesquisa.| 0 | number |
| `title` | Pesquisa por um Texto  (títulos de obras). | null | string |

>[!WARNING]
> Ao usar as categorias, verifique se está passando o tipo de mídia certo dessa categoria em específico

>[!CAUTION]
>Se o tipo de mídia é de Texto  mas a categoria passada for para Áudio, a lista dos valores retornados será vazia


#### Tabela de Tipos de Mídia

| Número | Tipo de Mídia |
|-|-|
| 5 | Imagem |
| 3 | Som |
| 2 | Texto |
| 6 | Vídeo |

#### Tabela de Categorias

| Categoria | Número | Tipo de mídia |
|-|-|-|
| Administração | 43 | Texto |
| Agronomia | 69 | Texto |
| Arquitetura | 89 | Texto |
| Artes | 20| Texto |
| Astronomia | 68 | Texto |
| Biologia Geral | 50| Texto |
| Blues | 22 | Áudio |
| Ciência da Computação | 32 | Texto |
| Ciência da Informação | 52 | Texto |
| Ciência Política | 74 | Texto |
| Ciências da Saúde | 48 | Texto |
| Coleção Educadores | 133 | Texto |
| Comunicação | 80| Texto |
| Conselho Nacional de Educação - CNe | 95 | Texto |
| Defesa civil | 121 | Texto |
| Direito | 21 | Texto |
| Direitos humanos | 124 | Texto |
| Economia | 73 | Texto |
| Economia Doméstica | 39 | Texto |
| Educação | 44 | Texto |
| Educação - Trânsito | 40| Texto |
| Educação Ambiental | 131 | Vídeo |
| Educação Física | 58 | Texto |
| Engenharias | 59 | Texto |
| Escola Brasil | 88 | Áudio |
| Farmácia | 70| Texto |
| Filosofia | 54 | Texto |
| Física | 61 | Texto |
| Fotografia | 19 | Imagem |
| FUNAG - Conferência | 12 | Vídeo |
| FUNAG - Curso | 130| Vídeo |
| Geociências | 97 | Texto |
| Geografia | 82 | Texto |
| Gravura | 38 | Imagem |
| Hinos | 5 | Áudio |
| História | 41 | Texto |
| História Geral da África | 132 | Texto |
| Ilustração | 8 | Imagem |
| Jazz| 24 | Áudio |
| Legislação Educacional | 134 | Texto |
| Línguas | 81 | Texto |
| Literatura | 2 | Texto |
| Literatura de Cordel | 35 | Texto |
| Literatura Infantil | 33 | Texto |
| Litografia | 56 | Imagem |
| Mapa | 9 | Imagem |
| Matemática | 67 | Texto |
| Medicina | 65 | Texto |
| Medicina Veterinária | 86 | Texto |
| Meio Ambiente | 109 | Texto |
| Meteorologia | 119 | Texto |
| Multidisciplinar | 4 | Texto |
| Música | 125 | Texto |
| Música Contemporânea | 18 | Áudio |
| Música Erudita | 6 | Áudio |
| Música Erudita Brasileira | 96 | Áudio |
| Música Militar | 26 | Áudio |
| Música Natalina | 7 | Áudio |
| Música Regional | 27 | Áudio |
| Passeios Virtuais | 28 | Vídeo |
| Pintura (uso educacional e não-comercial) | 10| Imagem |
| Pop Rock| 84 | Áudio |
| PROFORMAÇÃO - Programa de Formação de Professores em Exercício | 120| Vídeo |
| Psicologia | 30| Texto |
| Química | 66 | Texto |
| Rádio Escola | 79 | Áudio |
| Recortes | 36 | Imagem |
| Relações Internacionais | 129 | Texto |
| Religião | 118 | Vídeo |
| Satélite | 11 | Imagem |
| Saúde Coletiva | 78 | Texto |
| Serviço Social | 85 | Texto |
| Sociologia | 62 | Texto |
| Teologia | 17 | Texto |
| Teses e Dissertações | 57 | Texto |
| Tome Ciência | 126 | Áudio |
| Trabalho | 122 | Texto |
| Turismo | 123 | Texto |
| TV Escola - Arte | 103 | Vídeo |
| TV Escola - Ciências | 104 | Vídeo |
| TV Escola - Com Ciência | 115 | Vídeo |
| TV Escola - Como fazer? A Escola | 116 | Vídeo |
| TV Escola - Educação Especial | 100| Vídeo |
| TV Escola - Educação Física | 101 | Vídeo |
| TV Escola - Escola / Educação | 102 | Vídeo |
| TV Escola - Ética | 105 | Vídeo |
| TV Escola - Fazendo Escola | 114 | Vídeo |
| TV Escola - Geografia | 117 | Vídeo |
| TV Escola - História | 106 | Vídeo |
| TV Escola - Língua Portuguesa | 107 | Vídeo |
| TV Escola - Literatura | 108 | Vídeo |
| TV Escola - Matemática | 99 | Vídeo |
| TV Escola - Pluralidade Cultural | 110| Vídeo |
| TV Escola - Sala de Professor | 113 | Vídeo |
| TV Escola - Salto para o Futuro | 112 | Vídeo |
| TV Escola - Saúde | 111 | Vídeo |

#### Tabela de Idiomas

| Número | Idioma |
|-|-|
| 11 | Alemão |
| 18 | Dinamarquês |
| 7 | Espanhol |
| 12 | Esperanto |
| 19 | Finlandês |
| 10| Francês |
| 8 | Galego |
| 17 | Holandês |
| 2 | Inglês |
| 15 | Italiano |
| 9 | Latim |
| 5 | Não Aplicável |
| 14 | Norueguês |
| 1 | Português |
| 16 | Russo |
| 21 | Sânscrito |
| 13 | Sueco |

#### Tabela para o filterBy

| Texto | Descrição |
|-|-|
| DS_FORMATO | Ordenar por formato da obra |
| DS_INSTITUICAO | Ordenar por fonte ou instituição |
| DS_TITULO | Ordenar por título da obra |
| NO_AUTOR | Ordenar por nome do autor |
| NU_PAGE_HITS | Ordenar pelo número de acessos |
| NU_TAMANHO | Ordenar pelo tamanho do arquivo |

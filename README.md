<p align="center">
  <img src="https://thumbs.dreamstime.com/b/credit-score-gauge-rating-meter-vector-icon-flat-style-isolated-white-background-107738613.jpg" width="200" alt="Credit Score Logo" />
</p>

<p align="center">Calculo de score de crédito baseado no patrimônio e dívidas de uma pessoa.</p>


## Descrição
Credit Score é uma api que baseado nos dados enviados irá calcular o score de crédito.

### O Cáculo

Vamos supor que Ludovico possui o seguinte cenário:

Patrimônios(**P**):
- Apartamento no valor de R$ 513.000,00
- Casa na praia no valor de R$ 1.200.000,00
- Carro - R$ 67.000,00

Dívidas(**D**):
- Financiamento da Casa na Praia - R$ 1.200.000,00

Então calculamos a diferenca(**P-D**): R$ 580.000,00, que indica o que não está comprometido nas dívidas.

Baseado na diferença realizamos o seguint calculo para descobrir o score:
```
_(580.000 * 1000) / 1.780.000_ = 325
```

Assim Score do Ludovico é de **325**. 

## Como Executar o projeto

Para rodar o projeto será necessário o Node.js e para controlar as versões de forma mais facil sugiro a utilização do nvm.

```bash
# clonar o projeto
$ git clone git@github.com:leonardoporto/credit-score.git
# Acesar a pasta do projeto
$ cd credit-score
# criar o .env
$ cp .env.example .env
```
Agora para rodar o projeto temos 2 opções, a primeira será nessário o redis e mongodb externos, na segunda opção somente o Docker.
### Via script

```bash
#instalar as dependências
$ yarn install
#executar o projeto
$ yarn start:dev

```

### Via Docker
```bash
$ docker-compose up
```

## Tecologias utilizadas
- TypeScript
- MongoDb
- Redis
- Mongoose
- Jest
- Nestjs
- Redoc
- Docker
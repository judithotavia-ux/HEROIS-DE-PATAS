# 🐾 Heróis de Patas — FIFI E SUA TURMA

Jogo de plataforma/ação 2D em pixel art, 100% navegador (HTML5 Canvas + JavaScript puro), sem build step e sem dependências externas.

Desenvolvido por **Judith Otavia Margarido de Andrade**.

Dedicado à tutora jamais esquecida, **Maria Estela**.

> "O justo atenta para a vida dos seus animais, mas o coração dos perversos é cruel." — Provérbios 12:10

## Como jogar

Abra `index.html` por um servidor local (não use `file://` diretamente, alguns navegadores bloqueiam módulos/localStorage nesse modo):

```
# Node
npx serve .
# ou Python
python -m http.server 8080
```

Depois acesse `http://localhost:8080` (ou a porta indicada).

### Controles

| Tecla | Ação |
|---|---|
| ← → / A D | Mover |
| ↑ / Espaço / W | Pular |
| Shift | Correr |
| J | Atacar |
| K | Habilidade especial do herói |
| E | Resgatar animal (perto de uma gaiola) |
| C | Trocar de herói (entre os já desbloqueados) |
| I | Abrir inventário |
| M | Abrir missões |
| P | Pausar |

## Estrutura do projeto

```
web-game/
├── index.html              # marcação de todas as telas + canvas do jogo
├── assets/
│   └── LEIA-ME.txt         # onde colocar a foto real da Maria Estela
├── css/
│   └── style.css           # todo o visual (menus, HUD, overlays, cutscene final)
└── js/
    ├── core.js              # namespace HDP, constantes e utilitários
    ├── data/
    │   ├── characters.js    # os 10 heróis jogáveis + mentora (créditos) + final
    │   ├── items.js         # tipos de item coletável
    │   ├── animals.js       # animais resgatáveis (gaiolas)
    │   ├── enemies.js       # tipos de inimigo (incl. chefes)
    │   ├── missions.js      # definição das missões por mapa
    │   └── maps.js          # as 14 fases jogáveis (tema, inimigos, itens, resgates)
    ├── engine/
    │   ├── sprites.js       # renderizador de pixel art 100% procedural
    │   ├── audio.js         # efeitos sonoros sintetizados (Web Audio API)
    │   ├── input.js         # teclado
    │   └── particles.js     # partículas e textos flutuantes
    ├── state.js              # progresso persistente + salvar/carregar
    ├── entities.js            # fábricas de jogador/inimigo/gaiola/item
    ├── world.js               # construção da fase, colisão, clima e trem
    ├── combat.js              # ataque, habilidades especiais, dano
    ├── game.js                # loop principal (update/render), clima, trem, troca de herói
    ├── ui.js                  # menus, HUD, telas de inventário/missões/créditos/final
    └── main.js                # inicialização e ligação dos botões
```

Nenhum arquivo é um exemplo — todos são funcionais e foram testados rodando o jogo em navegador (Chromium via Playwright), sem erros de console, com todas as telas e mecânicas validadas.

## A campanha (14 fases jogáveis + final cinematográfico)

| # | Fase | Destaques |
|---|---|---|
| 1 | Floresta Encantada | introdução, gosmas e morcegos |
| 2 | Vila Abandonada | lobos e ratos gigantes |
| 3 | Praia Tempestuosa | caranguejos e gaivotas |
| 4 | Covil Sombrio | chefe: Lobo Alfa |
| 5 | Caverna Misteriosa | enigmas, passagens secretas, muita plataforma |
| 6 | Jardim das Flores | encontre a Amora, recupere animais doentes |
| 7 | Selva Amazônica | onças, cobras, árvores gigantes |
| 8 | Temporal | **chuva + relâmpagos** (clima dinâmico) |
| 9 | Montanha | escalada — mapa com o maior número de plataformas |
| 10 | Cidade Abandonada | resgate cães e depois gatos (missões em sequência) |
| 11 | Ferrovia | **trem que cruza a fase** — precisa desviar/pular |
| 12 | Cidade Grande | missões urbanas, mais inimigos |
| 13 | Base dos Capturadores | infiltração, liberte dezenas de animais |
| 14 | Batalha Final | capturadores + chefe final; **troque de herói (tecla C)** e use a habilidade especial de cada um |
| 15 | O Grande Lar | não é jogável — cutscene final com fala da Maria Estela, seguida dos créditos |

## Sistemas implementados

- **10 heróis jogáveis**: Fifi, Pretinha, Safira, Spike, Peludinho, Amora, Benjamin, Sansão, Totó e Zarolho — cada um com stats, título, habilidade especial única e sprite de pixel art com paleta própria. Todos jogáveis (Fifi desbloqueada de início; os demais são desbloqueados com moedas). Fifi usa vestido rosa, Pretinha usa laço vermelho, Totó usa bandana verde e Zarolho tem um olho visivelmente maior que o outro (marca do resgate dele).
- **Troca de herói em combate**: pressione **C** a qualquer momento para alternar entre os heróis já desbloqueados, mantendo posição/velocidade — pensado especialmente para a Batalha Final, onde a ideia é usar a habilidade especial de vários heróis.
- **Maria Estela**: não é jogável — é a tutora que aparece nos Créditos, com foto (coloque o arquivo em `assets/maria-estela.jpg` — instruções em `assets/LEIA-ME.txt`), frase e o versículo de Provérbios 12:10. Ela também aparece na cutscene final (Fase 15) com uma fala diferente.
- **Sprites em pixel art**: gerados 100% por código (`js/engine/sprites.js`), desenhados em blocos sobre uma grade 16×16, sem nenhuma imagem externa — funciona offline e sem qualquer asset para baixar.
- **14 mapas**: cada um com paleta própria, inimigos, plataformas, itens e gaiolas de resgate exclusivos, mais dois mapas com mecânica extra (clima e trem — veja acima). Progressão linear com viagem rápida entre fases já desbloqueadas (menu Mapas / pausa).
- **Inventário**: moedas, ossos, corações, gemas e galeria de animais resgatados.
- **Missões**: cada mapa tem missões obrigatórias (bloqueiam o portal de saída) e bônus (recompensa extra), com barra de progresso na tela de Missões e mini-HUD durante o jogo.
- **Combate**: ataque corpo a corpo, inimigos com IA de perseguição/patrulha, chefes de fase, dano com crítico, drops aleatórios.
- **Amizade**: pontos de amizade por herói, sobem ao derrotar inimigos e resgatar animais, com títulos (Conhecido → Alma Gêmea).
- **Resgate de animais**: gaiolas espalhadas pelos mapas, libertadas com a tecla E, contam para missões e para a galeria do inventário.
- **Evolução**: XP e níveis por herói, com bônus de atributo por nível e tiers (Iniciante → Lendário).
- **Menus**: Menu principal, Personagens, Mapas, Inventário, Missões, Créditos, Pausa, Game Over, Fase Concluída e Final cinematográfico.
- **Salvar jogo**: tudo persiste em `localStorage` (personagem atual, desbloqueios, inventário, amizade, evolução, resgates, missões e progresso nos mapas), com salvamento manual (botão/tecla) e automático ao completar uma fase.

## Testes realizados

O jogo foi validado com um driver Playwright headless cobrindo: carregamento do menu, os 10 personagens, os 14 mapas, movimento/ataque/especial/pulo/pausa, a tempestade com chuva e relâmpago (Fase 8), a colisão com o trem (Fase 11, dano confirmado), a troca de herói em combate (Fase 14) e a cutscene final com os créditos — sem nenhum erro de console real em nenhuma etapa (a única mensagem de rede é o 404 esperado da foto da Maria Estela, que ainda não foi adicionada).

## Melhorias futuras

- Sprites com mais frames de animação (idle, ataque dedicado por direção, morte).
- Efeitos sonoros/música de fundo por mapa (hoje só há efeitos sintetizados).
- Suporte a controle (gamepad) e touch/mobile com botões virtuais.
- Editor de fases em JSON externo (hoje os mapas são gerados proceduralmente a partir de `js/data/maps.js`).
- Multiplayer local (2 jogadores, teclado dividido).
- Sistema de diálogo/NPCs falantes para dar mais contexto às missões (ex.: Peludinho nos enigmas da caverna, moradores na Cidade Grande).

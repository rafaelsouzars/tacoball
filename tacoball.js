/*
	tacoball.js, 26/12/2022
	Autor: Rafael Souza (muirak)
	Biblioteca "Brazuca" para criação de jogos 2D em HTML5.
*/

const CONFIG_TELA = {
	altura: 480,
	largura: 320,
	gravidade: 480/1.3
}



//Classe de inicialização da tela
class Tela {
	//Propriedades e atributos.
	
	//Propriedades de tamanho da tela
	#_altura;
	#_largura;
	//Propriedades do plano de fundo da tela.
	#_fundo;
	//Atributos da classe.
	#tela;
	#canvas;
	#ctx;
	#barra;
	//Lista de objetos (jogador/inimigo/itens) do jogo
	#indJogadores = 1;
	#indInimigos = 1;
	#indItens = 1;
	#listaSprites;	
	//Eventos
	#evtDesenharTudo;
	#evtDesenharHUD;
	#evtDesenharSprites
	//#evtDesenharJogadores;
	//#evtDesenharInimigos;
	
	//Construtor do objeto "Tela"
	constructor(){
		//Iniciando valores padrões do objeto
		this.#_altura = CONFIG_TELA.altura;
		this.#_largura = CONFIG_TELA.largura;
		this.#listaSprites = [];		
		this.#evtDesenharHUD = new CustomEvent("desenharHUD",{detail: "Desenhando e atualizando tela.",bubbles: true, cancelable: true});		
		this.#evtDesenharSprites = new CustomEvent("desenharSprites",{detail: "Desenhando e atualizando tela.",bubbles: true, cancelable: true});
		//this.#evtDesenharInimigos = new CustomEvent("desenharInimigos",{detail: "Desenhando e atualizando tela.",bubbles: true, cancelable: true});
		console.log("Objeto 'Tela' foi criado.");
		
		//Criando dinâmicamente o elemento canvas no HTML
		try{
			let canvas = document.createElement("canvas");
			canvas.id = "tela";
			canvas.height = this.#_altura;
			canvas.width = this.#_largura;
			//canvas.style = "border:1px solid #000000;border-radius: 10px";	
			canvas.style = "border:1px solid #000000";			
			
			document.body.appendChild(canvas);
		
			this.#tela = document.getElementById(canvas.id);
			this.#ctx = this.#tela.getContext("2d");				
		}
		
		catch(err){
			console.log(err.message);
		}		

		//this.#iniciarEventos();
		
		
		setInterval(function(){
			this.desenharTela();
		}.bind(this),1000/30);
	}	
	
	#iniciarEventos(){
		this.#tela.addEventListener("desenhar",function(e){
			console.log(e);
			console.log(e.detail);
		});
	}
	
	
	iniciarTemporizador(){		
			
	}	
		
	//Metodo responsavel em desenhar a tela do jogo
	desenharTela(){
		this.#ctx.reset();
		this.#tela.dispatchEvent(this.#evtDesenharHUD);
		this.#tela.dispatchEvent(this.#evtDesenharSprites);						
	}
	
	get tela(){
		
	}
	
	get contextoTela(){
		return this.#ctx;
	}
	
	get alturaTela(){
		return this.#_altura;
	}
	
	get larguraTela(){
		return this.#_largura;
	}
	
	getJogador(id){		
		return this.#listaSprites.find((lista,indice,array) => lista.id === id);
	}
	
	getInimigo(id){		
		return this.#listaSprites.find((lista,indice,array) => lista.id === id);
	}	
	
	adicionarJogador(id,posX,posY,tamanho){
		let obj = new Jogador(id,this.#ctx,posX,posY,tamanho);
		this.#listaSprites.push(obj);
		return obj;
	}	
	
	adicionarInimigo(id,posX,posY,tamanho){
		let obj = new Inimigo(id,this.#ctx,posX,posY,tamanho);
		this.#listaSprites.push(obj);
		return obj;
	}
	
	adicionarProjetil(id,posX,posY,tamanho){
		let obj = new Projetil(id,this.#ctx,posX,posY,tamanho);
		this.#listaSprites.push(obj);
		return obj;
	}
	
	removerJogador(id){		
		let indice = this.#listaSprites.findIndex((lista,indice,array) => lista.id === id);
		this.#listaSprites.splice(indice,1);
	}	
	
	removerInimigo(id){
		let indice = this.#listaSprites.findIndex((lista,indice,array) => lista.id === id);
		this.#listaSprites.splice(indice,1);
	}
	
	removerProjetil(id){
		let indice = this.#listaSprites.findIndex((lista,indice,array) => lista.id === id);
		this.#listaSprites.splice(indice,1);
	}
	
	adicionarItem(){
		
	}
}

//Classe de inicialização do temporizador
class Temporizador {
	//Propriedades e atributos
	#intervalo;
	#milisegundo
	#segundo;
	#minuto;
	#hora;
	#estado;
	#f;
	
	constructor(){
		this.#intervalo = 1000;
		this.#estado = false;
		this.#f = function(){
			console.log("ok");
		};
	}
	
	get intervalo(){
		return this.#intervalo;
	}
	
	set intervalo(intervalo){
		this.#intervalo = intervalo;
	}
	
	estado(){		
		this.#f;
	}
	
	/*estado(estado){
		this.#estado = estado;
	}*/
	
	iniciarContador(segundos){		
		
		if(segundos<0){
			segundos++;			
			console.log("Valor menor que zero. Atualizado para: " + segundos + "s");			
		}else{
			console.log("Iniciar contador em: " + segundos + "s");			
		}
		
		let contador = segundos;		
		
		let temporizador = setInterval(function(){
			console.log(contador + "s");
			contador--;			
			if(contador<0){
				clearInterval(temporizador);
			}
		},this.#intervalo);
	}	
	
	
}

//Classe de tratamento de colisões
class Colisao {
	
	#objColisao;
	#listaAcoes;
	constructor(jog){
		this.#objColisao = [];
		this.#listaAcoes = new ListaAcoes();		
		document.addEventListener("spriteMovimento",function(){
			this.testarColisao(jog);
		}.bind(this));			
	}
	
	adicionarAcao(id,idObjCol,callback,descricao){
		this.#listaAcoes.adicionarAcao(id,idObjCol,callback,descricao);
	}	
	
	adicionarObjetoColisao(obj){
		this.#objColisao.push(obj);		
	}
	
	testarColisao(jog){		
		this.#objColisao.forEach((obj,indice,array) => this.detectarColisao(jog,obj));		
	}
	
	detectarColisao(objA,objB){		
		if(objA.posX < objB.posX + objB.largura &&
		objA.posX + objA.largura > objB.posX &&
		objA.posY < objB.posY + objB.altura &&
		objA.altura + objA.posY > objB.posY){
			//Colisão			
			try{
				console.log("Colisão entre '" + objA.id + "' e '" + objB.id + "'");
				this.#listaAcoes.executarAcao(objB.id);
			}
			catch{
				console.log("Nenhuma ação vinculada a colisão com objeto: '" + objB.id + "'");
			}			
		}else{
			//Sem colisão
			
		}
	}
	
	stringOf(){
		this.#objColisao.forEach((element,index,array) => console.log("Objeto colisão #" + index + ": " + element.id));
	}
}

//Lista de ações
class ListaAcoes {
	#id;
	#idObjCol;	
	#callback;
	#listaAcoes;
	
	constructor(){
		this.#listaAcoes = [];
	}
	
	adicionarAcao(id, idObjCol, callback, descricao){
		let obj = { id: id, idObjCol: idObjCol, callback:  callback, descricao: descricao};
		this.#listaAcoes.push(obj);
		console.log(obj);
	}
	
	removerAcao(id){
		let indice = this.#listaAcoes.findIndex((lista,indice,array) => lista.id === id);
		this.#listaAcoes.splice(indice,1);
	}
	
	executarAcao(idObjCol){
		let obj = this.#listaAcoes.find((lista,indice,array) => lista.idObjCol === idObjCol);
		obj.callback();
		console.log("Executar " + obj.id + " : " + obj.descricao);
	}
}

//Classe inicialização dos controles
class Controle {
	
	#comando;
	#tecla;
		
	constructor(sprite){
		console.log("Objeto 'Controle' foi criado.");	
		
		this.#comando = [
			{tecla: 'ArrowUp', estado: 'up', acao: ()=>{sprite.movimentoCima()}},
			{tecla: 'ArrowDown', estado: 'up', acao: ()=>{sprite.movimentoBaixo()}},
			{tecla: 'ArrowLeft', estado: 'up', acao: ()=>{sprite.movimentoEsquerda()}},
			{tecla: 'ArrowRight', estado: 'up', acao: ()=>{sprite.movimentoDireita()}},
			{tecla: 'KeyZ', estado: 'up', acao: ()=>{console.log("Z")}},
			{tecla: 'KeyX', estado: 'up', acao: ()=>{console.log("X")}},
			{tecla: 'Shiftleft', estado: 'up', acao: ()=>{console.log("ShiftEsquerdo")}},
			{tecla: 'ControlLeft', estado: 'up', acao: ()=>{console.log("ShiftEsquerdo")}},
			{tecla: 'Space', estado: 'up', acao: ()=>{sprite.movimentoTiro()}}		
		];
		
		let indice;
		
		console.log(this.#comando);
		
		document.addEventListener("keydown",function(e){			
			switch (e.code) {
				case "ArrowUp":					
					indice = this.#comando.findIndex((obj,indice,array) => obj.tecla === "ArrowUp");
					this.#comando[indice].estado = "down";				
				break;
				case "ArrowDown":
					indice = this.#comando.findIndex((obj,indice,array) => obj.tecla === "ArrowDown");
					this.#comando[indice].estado = "down";					
				break;
				case "ArrowLeft":
					indice = this.#comando.findIndex((obj,indice,array) => obj.tecla === "ArrowLeft");
					this.#comando[indice].estado = "down";					
				break;
				case "ArrowRight":
					indice = this.#comando.findIndex((obj,indice,array) => obj.tecla === "ArrowRight");
					this.#comando[indice].estado = "down";				
				break;
				case "KeyZ":
					indice = this.#comando.findIndex((obj,indice,array) => obj.tecla === "KeyZ");
					this.#comando[indice].estado = "down";
				break;
				case "KeyX":
					indice = this.#comando.findIndex((obj,indice,array) => obj.tecla === "KeyX");
					this.#comando[indice].estado = "down";
				break;
				case "ShiftLeft":
					indice = this.#comando.findIndex((obj,indice,array) => obj.tecla === "ShiftLeft");
					this.#comando[indice].estado = "down";
				break;
				case "ControlLeft":
					indice = this.#comando.findIndex((obj,indice,array) => obj.tecla === "ControlLeft");
					this.#comando[indice].estado = "down";
				break;
				case "Space":
					indice = this.#comando.findIndex((obj,indice,array) => obj.tecla === "Space");
					this.#comando[indice].estado = "down";
				break;
			}
		}.bind(this));
		
		document.addEventListener("keyup",function(e){			
			switch (e.code) {
				case "ArrowUp":
					indice = this.#comando.findIndex((obj,indice,array) => obj.tecla === "ArrowUp");
					this.#comando[indice].estado = "up";				
				break;
				case "ArrowDown":
					indice = this.#comando.findIndex((obj,indice,array) => obj.tecla === "ArrowDown");
					this.#comando[indice].estado = "up";					
				break;
				case "ArrowLeft":
					indice = this.#comando.findIndex((obj,indice,array) => obj.tecla === "ArrowLeft");
					this.#comando[indice].estado = "up";				
				break;
				case "ArrowRight":
					indice = this.#comando.findIndex((obj,indice,array) => obj.tecla === "ArrowRight");
					this.#comando[indice].estado = "up";					
				break;
				case "KeyZ":
					indice = this.#comando.findIndex((obj,indice,array) => obj.tecla === "KeyZ");
					this.#comando[indice].estado = "up";
				break;
				case "KeyX":
					indice = this.#comando.findIndex((obj,indice,array) => obj.tecla === "KeyX");
					this.#comando[indice].estado = "up";
				break;
				case "ShiftLeft":
					indice = this.#comando.findIndex((obj,indice,array) => obj.tecla === "ShiftLeft");
					this.#comando[indice].estado = "up";
				break;
				case "ControlLeft":
					indice = this.#comando.findIndex((obj,indice,array) => obj.tecla === "ControlLeft");
					this.#comando[indice].estado = "up";
				break;
				case "Space":
					indice = this.#comando.findIndex((obj,indice,array) => obj.tecla === "Space");
					this.#comando[indice].estado = "up";
				break;
			}
		}.bind(this));	
		
		setInterval(function(){
			this.#comando.forEach((obj,indice,array) => {
				if(obj.estado == "down"){
					obj.acao();
				}
			});
		}.bind(this),50);

		
		
	}
	
	
}

//Classe base para as barras do HUD
class Barra {
	//Metodos e atributos
	#_min = 0;
	#_max = 100;
	#valor = 100;
	
	constructor(){		
		console.log("Objeto 'Barra' foi criado.");
	}
	
	get valor(){		
		return this.#valor;
	}
	
	set valor(valor){
		if((valor<this.#_min)|(valor>this.#_max)){
			console.log("Valor da barra fora do intervalo!!!");
		}else{
			this.#valor = valor;			
		}		
	}
	
	get limiteMinimo(){		
		return this.#_min;		
	}
	
	set limiteMinimo(min){
		if(min<0){
			this.#_min = 0;			
		}else{
			if(min>=this.#_max){
				this.#_min = this.#_max - 1;				
			}else{
				this.#_min = min;				
			}			
		}		
	}
	
	get limiteMaximo(){		
		return this.#_max;		
	}
	
	set limiteMaximo(max){
		if(max<=this.#_min){
			this.#_max = this.#_min + 1;			
		}else{
			if(max>100){
				this.#_max = 100;				
			}else{
				this.#_max = max;				
			}			
		}
	}
	
}

class BarraVida extends Barra {
	#ctx;
	#indiceCamada = 0;
	#valor;
	#_posX = 10;
	#_posY = 10;
	#_altura = 10;
	
	constructor(ctx){
		super();
		this.#valor = super.valor;
		this.#ctx = ctx;
		this.desenhar();
		document.addEventListener("desenharHUD",function(e){
			this.desenhar();
		}.bind(this));
		console.log("Objeto 'barra de vida' foi criado");
	}
	
	desenhar(){
		this.#ctx.fillStyle = "black";
		this.#ctx.strokeRect(this.#_posX,this.#_posY,super.limiteMaximo,this.#_altura);
		this.#ctx.fillStyle = "green";
		this.#ctx.fillRect(this.#_posX,this.#_posY,super.valor,this.#_altura);
	}	
	
	
	posicao(posX,posY){
		if(posX<0){
			this.#_posX = 1;
			console.log("Posição X da Barra menor que zero. Atualizada para: " + this.#_posX);
		}else{
			this.#_posX = posX;
		}
		
		if(posY<0){
			this.#_posY = 1;
			console.log("Posição Y da Barra menor que zero. Atualizada para: " + this.#_posY);
		}else{
			this.#_posY = posY;
		}		
	}
}

//Classe base de sprites
class Sprite {
	#id;
	#tipo = "sprite";
	#indiceCamada = 1;
	#tela;
	#cor;
	#ctx;
	#posX = CONFIG_TELA.largura / 2;
	#posY = CONFIG_TELA.altura / 2;
	#altura = 10;
	#largura = 10;
	#tamanho = 10;
	#velocidade = 10;
	#gravidade = CONFIG_TELA.gravidade;
	#visibilidade = true;
	//Evento	
	#evtSpriteMovimento;
	#evtSpriteTiro;
	#evtSpriteDestruir;
		
	
	
	constructor(id,ctx,posX,posY,tamanho){
		this.#id = id;
		this.#posX = posX;
		this.#posY = posY;		
		this.#tamanho = tamanho;
		this.#altura = this.#tamanho;
		this.#largura = this.#tamanho;
		this.#cor = "blue";
		this.#tela = document.getElementById("tela");
		this.#ctx = ctx;
		
		this.#evtSpriteMovimento = new CustomEvent(this.#tipo + "Movimento",{detail: "Sprite em movimento",bubbles: true, cancelable: true});
		this.#evtSpriteTiro = new CustomEvent(this.#tipo + "Tiro",{detail: "Sprite atirou",bubbles: true, cancelable: true});
		this.#evtSpriteDestruir = new CustomEvent(this.#tipo + "Destruido",{detail: "Sprite foi destruido",bubbles: true, cancelable: true});
		
		this.desenhar();
		
		document.addEventListener("desenharSprites",function(e){
			if(this.#visibilidade){
				this.desenhar();
			}			
		}.bind(this));
		console.log("Objeto sprite '" + this.#id + "' foi criado.");		
	}	
	
	destruir(){
		this.#tela.dispatchEvent(this.#evtSpriteDestruir);
		this.#visibilidade = false;		
		console.log("Objeto '" + this.#id + "' destruido.");		
		
	}	
	
	get id(){
		return this.#id;
	}
	
	get ctx(){
		return this.#ctx;
	}
	
	get posX(){
		return this.#posX;
	}
	
	get posY(){
		return this.#posY;
	}
	
	get largura(){
		return this.#largura;
	}	
	
	get altura(){
		return this.#altura;
	}
	
	get tamanho(){
		return this.#tamanho;
	}
	
	get tipo(){
		return this.#tipo;
	}

	set tipo(tipo){
		this.#tipo = tipo;
	}
	
	set cor(cor){
		this.#cor = cor;
	}
	
	set tamanho(tamanho){
		this.#altura = tamanho;
		this.#largura = tamanho;
	}
	
	set visibilidade(visibilidade){
		this.#visibilidade = visibilidade;
	}
	
	desenhar(){
		this.#ctx.fillStyle = this.#cor;
		this.#ctx.fillRect(this.#posX,this.#posY,this.#largura,this.#altura);
	}
	
	movimentarSprite(posX,posY){
		this.#posX = posX;
		this.#posY = posY;
		this.#tela.dispatchEvent(this.#evtSpriteMovimento);
	}
	
	movimentoCima(){
		if(this.#posY > 0){			
			this.#posY = this.#posY - this.#velocidade;
			this.#tela.dispatchEvent(this.#evtSpriteMovimento);
		}else{
			this.#posY = 0;
		}		
	}
	
	movimentoBaixo(){
		if(this.#posY < (CONFIG_TELA.altura - this.#altura)){			
			this.#posY = this.#posY + this.#velocidade;
			this.#tela.dispatchEvent(this.#evtSpriteMovimento);
		}else{
			this.#posY = CONFIG_TELA.altura - this.#altura;
		}		
	}
	
	movimentoDireita(){
		if(this.#posX < (CONFIG_TELA.largura - this.#largura)){			
			this.#posX = this.#posX + this.#velocidade;
			this.#tela.dispatchEvent(this.#evtSpriteMovimento);
		}else{
			this.#posX = CONFIG_TELA.largura - this.#largura;	
		}		
	}
	
	movimentoEsquerda(){
		if(this.#posX > 0){			
			this.#posX = this.#posX - this.#largura;
			this.#tela.dispatchEvent(this.#evtSpriteMovimento);
		}else{
			this.#posX = 0;
		}		
	}
	
	movimentoPulo(){
		
	}
	
	movimentoTiro(){
		
	}
	
	detectarColisao(){
		if(this.#posX < obj.posX + obj.largura &&
		this.#posX + this.#largura > obj.posX &&
		this.#posY < obj.posY + obj.altura &&
		this.#altura + this.#posY > obj.posY){
			//Colisão
			console.log("ok");
		}else{
			//Sem colisão
			
		}
	}
	
}

//Classe Jogador
class Jogador extends Sprite {
	
		
	constructor(id,ctx,posX,posY,tamanho){
		super(id,ctx,posX,posY,tamanho);
		super.tipo = "jogador";			
	}
	
	movimentoTiro(){
			let obj = new Projetil("projetil2",super.ctx,super.posX+3,super.posY,4);			
			let tInt = setInterval(function(){					
				if(obj.posY>0){					
					obj.movimentarSprite(obj.posX,obj.posY-10);					
				}else{
					obj.destruir();	
					obj = null;					
					clearInterval(tInt);									
				}
			}.bind(this),1000/20);				
		
	}
	
}

//Classe Inimigo
class Inimigo extends Sprite {	
	
	constructor(id,ctx,posX,posY,tamanho){
		super(id,ctx,posX,posY,tamanho);
		super.cor = "red";
		super.tipo = "inimigo";
	}	
	
}

class Projetil extends Sprite {
	
	constructor(id,ctx,posX,posY,tamanho){		
		super(id,ctx,posX,posY,tamanho);
		super.tipo = "projetil";				
	}
	
}

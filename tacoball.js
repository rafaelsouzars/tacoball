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
	//Eventos
	#evtDesenharTudo;
	#evtDesenharHUD;	
	#evtDesenharJogadores;
	#evtDenharInimigos;
	
	//Construtor do objeto "Tela"
	constructor(){
		//Iniciando valores padrões do objeto
		this.#_altura = CONFIG_TELA.altura;
		this.#_largura = CONFIG_TELA.largura;
		this.#evtDesenharHUD = new CustomEvent("desenharHUD",{detail: "Desenhando e atualizando tela.",bubbles: true, cancelable: true});		
		this.#evtDesenharJogadores = new CustomEvent("desenharJogadores",{detail: "Desenhando e atualizando tela.",bubbles: true, cancelable: true});
		this.#evtDenharInimigos = new CustomEvent("desenharInimigos",{detail: "Desenhando e atualizando tela.",bubbles: true, cancelable: true});
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
		this.#tela.dispatchEvent(this.#evtDesenharJogadores);
		this.#tela.dispatchEvent(this.#evtDesenharHUD);				
	}
	
	get contextoTela(){
		return this.#ctx;
	}
	
	get alturaTela(){
		
	}
	
	get larguraTela(){
		
	}
	
	//Atualiza o objeto "tela"
	atualizarTela(){
		
	}
	
	ocultarTela(){
		
	}
	
	apresentarTela(){
		
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

class Jogador {
	#id;
	#indiceCamada = 1;
	#ctx;
	#posX = CONFIG_TELA.largura / 2;
	#posY = CONFIG_TELA.altura / 2;
	#altura = 10;
	#largura = 10;
	#velocidade = 10;
	#gravidade = CONFIG_TELA.gravidade;
	
	constructor(ctx){
		this.#ctx = ctx;	
		this.desenhar();
		document.addEventListener("desenharJogadores",function(e){
			this.desenhar();
		}.bind(this));
		console.log("Objeto jogador foi criado.");
	}
	
	desenhar(){
		this.#ctx.fillStyle = "blue";
		this.#ctx.fillRect(this.#posX,this.#posY,this.#largura,this.#altura);
	}
	
	movimentoCima(){
		if(this.#posY > 0){			
			this.#posY = this.#posY - this.#velocidade;							
		}else{
			this.#posY = 0;
		}		
	}
	
	movimentoBaixo(){
		if(this.#posY < (CONFIG_TELA.altura - this.#altura)){			
			this.#posY = this.#posY + this.#velocidade;			
		}else{
			this.#posY = CONFIG_TELA.altura - this.#altura;
		}		
	}
	
	movimentoDireita(){
		if(this.#posX < (CONFIG_TELA.largura - this.#largura)){			
			this.#posX = this.#posX + this.#velocidade;			
		}else{
			this.#posX = CONFIG_TELA.largura - this.#largura;	
		}		
	}
	
	movimentoEsquerda(){
		if(this.#posX > 0){			
			this.#posX = this.#posX - this.#largura;			
		}else{
			this.#posX = 0;
		}		
	}
	
	movimentoPulo(){
		
	}
	
	movimentoTiro(){
		
	}
}

//Classe inicialização dos controles
class Controle {
	#id;
	#comando;	
	#jogador;
	
	constructor(jogador){
		console.log("Objeto Controle foi criado.");
		
		document.addEventListener("keydown",function(e){			
			switch (e.code) {
				case "ArrowUp":
					jogador.movimentoCima();					
				break;
				case "ArrowDown":
					jogador.movimentoBaixo();					
				break;
				case "ArrowLeft":
					jogador.movimentoEsquerda();					
				break;
				case "ArrowRight":
					jogador.movimentoDireita();					
				break;
				case "KeyZ":
					console.log("Z");
				break;
				case "KeyX":
					console.log("X");
				break;
				case "ShiftLeft":
					console.log("ShiftEsquerdo");
				break;
				case "ControlLeft":
					console.log("ControlEsquerdo");
				break;
				case "Space":
					console.log("Espaço");
				break;
			}
		});
		
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
		this.#ctx.strokeRect(this.#_posX,this.#_posY,super.valor,this.#_altura);
		this.#ctx.fillStyle = "red";
		this.#ctx.fillRect(this.#_posX,this.#_posY,super.valor,this.#_altura);
	}
	
	set valor(valor){
		super.valor = valor;		
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
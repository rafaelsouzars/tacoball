/*
	tacoball.js, 26/12/2022
	Autor: Rafael Souza (muirak)
	Biblioteca "Brazuca" para criação de jogos 2D em HTML5.
*/

const TamanhoTela = {
	altura: 480,
	largura: 320
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
	#evento;		
	
	
	//Construtor do objeto "Tela"
	constructor(){
		//Iniciando valores padrões do objeto
		this.#_altura = TamanhoTela.altura;
		this.#_largura = TamanhoTela.largura;
		this.#evento = new CustomEvent("desenhar",{detail: "Desenhando e atualizando tela.",bubbles: true, cancelable: true});		
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
			console.log("Tela desenhada");
			
		}
		
		catch(err){
			console.log(err.message);
		}		

		//this.#iniciarEventos();
		
		
		setInterval(function(){
			this.desenharTela();
		}.bind(this),1000);
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
		this.#tela.dispatchEvent(this.#evento);				
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
	#ctx;
	#posX = TamanhoTela.largura / 2;
	#posY = TamanhoTela.altura / 2;
	
	constructor(ctx){
		this.#ctx = ctx;
		this.#ctx.fillStyle = "blue";
		this.#ctx.fillRect(this.#posX,this.#posY,10,10);
		document.addEventListener("desenhar",function(e){
			console.log(e);
			console.log(e.detail);
		});
	}
	
	movimentoCima(){
		if(this.#posY>0){
			this.#ctx.reset();
			this.#posY = this.#posY - 10;
			this.#ctx.fillStyle = "blue";
			this.#ctx.fillRect(this.#posX,this.#posY,10,10);
		}		
	}
	
	movimentoBaixo(){
		if(this.#posY<(TamanhoTela.altura-10)){
			this.#ctx.reset();
			this.#posY = this.#posY + 10;
			this.#ctx.fillStyle = "blue";
			this.#ctx.fillRect(this.#posX,this.#posY,10,10);
		}		
	}
	
	movimentoDireita(){
		if(this.#posX<(TamanhoTela.largura-10)){
			this.#ctx.reset();
			this.#posX = this.#posX + 10;
			this.#ctx.fillStyle = "blue";
			this.#ctx.fillRect(this.#posX,this.#posY,10,10);
		}		
	}
	
	movimentoEsquerda(){
		if(this.#posX>0){
			this.#ctx.reset();
			this.#posX = this.#posX - 10;
			this.#ctx.fillStyle = "blue";
			this.#ctx.fillRect(this.#posX,this.#posY,10,10);
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
		
		document.addEventListener("keydown",function(e){			
			switch (e.code) {
				case "ArrowUp":
					jogador.movimentoCima();
					console.log("Cima");
				break;
				case "ArrowDown":
					jogador.movimentoBaixo();
					console.log("Baixo");
				break;
				case "ArrowLeft":
					jogador.movimentoEsquerda();
					console.log("Esquerda");
				break;
				case "ArrowRight":
					jogador.movimentoDireita();
					console.log("Direita");
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

class Barra {
	//Metodos e atributos
	#_min = 0;
	#_max = 100;
	#valor = 100;
	
	constructor(){		
		console.log("Objeto 'Barra' criada.");
	}
	
	get valor(){
		console.log("Valor atual da barra: " + this.#valor);
		return this.#valor;
	}
	
	set valor(valor){
		if((valor<this.#_min)|(valor>this.#_max)){
			console.log("Valor da barra fora do intervalo!!!");
		}else{
			this.#valor = valor;
			console.log("Atualizando valor da barra: " + this.#valor);
		}		
	}
	
	get limiteMinimo(){
		console.log("Valor minimo da barra: " + this.#_min);
		return this.#_min;		
	}
	
	set limiteMinimo(min){
		if(min<0){
			this.#_min = 0;
			console.log("Limite minimo da barra menor que zero. Atualizado para: " + this.#_min);
		}else{
			if(min>=this.#_max){
				this.#_min = this.#_max - 1;
				console.log("Limite minimo da barra meior que o valor maximo. Atualizado para: " + this.#_min);
			}else{
				this.#_min = min;
				console.log("Limite minimo atualizado para: " + this.#_max);
			}			
		}		
	}
	
	get limiteMaximo(){
		console.log("Limite maximo da barra: " + this.#_max);
		return this.#_max;		
	}
	
	set limiteMaximo(max){
		if(max<=this.#_min){
			this.#_max = this.#_min + 1;
			console.log("Limite maximo da barra menor que valor minimo. Atualizado para: " + this.#_max);
		}else{
			if(max>100){
				this.#_max = 100;
				console.log("Limite maximo da barra meior que 100. Atualizado para: " + this.#_max);
			}else{
				this.#_max = max;
				console.log("Limite maximo atualizado para: " + this.#_max);
			}			
		}
	}
	
}

class BarraVida extends Barra {
	#ctx;
	#_posX = 10;
	#_posY = 10;
	constructor(ctx){
		super();
		this.#ctx = ctx;
		this.#ctx.fillStyle = "black";
		this.#ctx.strokeRect(this.#_posX,this.#_posY,super.valor,10);
		this.#ctx.fillStyle = "red";
		this.#ctx.fillRect(this.#_posX,this.#_posY,super.valor,10);
	}
	
	set valor(valor){
		super.valor = valor;		
		this.#ctx.fillStyle = "red";
		this.#ctx.strokeRect(this.#_posX,this.#_posY,valor,10);
		this.#ctx.fillStyle = "red";
		this.#ctx.fillRect(this.#_posX,this.#_posY,valor,10);
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
		
		this.#ctx.fillStyle = "red";
		this.#ctx.strokeRect(this.#_posX,this.#_posY,super.valor,10);
		this.#ctx.fillStyle = "red";
		this.#ctx.fillRect(this.#_posX,this.#_posY,super.valor,10);
	}
}
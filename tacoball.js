/*
	tacoball.js, 26/12/2022
	Autor: Rafael Souza (muirak)
	Biblioteca "Brazuca" para criação de jogos 2D em HTML5.
*/

const TamanhoTela = {
	altura: 480,
	largura: 320
}

class Tela {
	//Propriedades e atributos.
	
	//Propriedades de tamanho da tela
	#_altura;
	#_largura;
	//Propriedades do plano de fundo da tela.
	#_fundo;
	//Atributos da classe.
	#tela;
	#ctx;
	#barra;
	
	
	//Construtor do objeto "Tela"
	constructor(){
		this.#_altura = TamanhoTela.altura;
		this.#_largura = TamanhoTela.largura;		
		console.log("Objeto 'Tela' foi criado.");
		
		try{
			let tela = document.createElement("canvas");
			tela.id = "tela";
			tela.height = this.#_altura;
			tela.width = this.#_largura;
			tela.style = "border:1px solid #000000;border-radius: 10px";

			document.body.appendChild(tela);
		
			this.#tela = document.getElementById(tela.id);
			this.#ctx = this.#tela.getContext("2d");
			console.log("Tela desenhada");
		}
		
		catch(err){
			console.log(err.message);
		}
	}
	
	//Metodo responsavel em desenhar a tela do jogo
	desenharTela(){		
			
		
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
		this.#ctx.reset();
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
		
		this.#ctx.reset();
		this.#ctx.fillStyle = "red";
		this.#ctx.strokeRect(this.#_posX,this.#_posY,super.valor,10);
		this.#ctx.fillStyle = "red";
		this.#ctx.fillRect(this.#_posX,this.#_posY,super.valor,10);
	}
}
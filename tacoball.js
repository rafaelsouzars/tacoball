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
	//Propriedades e atributos
	
	//Dimensão da tela
	#altura;
	#largura;
	#tela;
	#ctx;
	
	//Construtor do objeto "Tela"
	constructor(){
		this.#altura = TamanhoTela.altura;
		this.#largura = TamanhoTela.largura;
		console.log("Objeto 'Tela' foi criado.");
	}
	
	//Metodo responsavel em desenhar a tela do jogo
	desenharTela(){
		
		try{
			let tela = document.createElement("canvas");
			tela.id = "tela";
			tela.height = this.#altura;
			tela.width = this.#largura;

			document.body.appendChild(tela);
		
			this.#tela = document.getElementById(tela.id);
			this.#ctx = this.#tela.getContext("2d");
			console.log("Tela desenhada");
		}
		
		catch(err){
			console.log(err.message);
		}	
		
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
	#valor;
	
	constructor(){
		this.#valor = 0;
		console.log("Barra criada.");
	}
	
	get valor(){
		console.log("Valor atual da barra: " + this.#valor);
		return this.#valor;
	}
	
	set valor(valor){
		this.#valor = valor;
		console.log("Atualizando valor da barra: " + this.#valor);
	}	
	
}
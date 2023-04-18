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

const RELOGIO = {
	iniciar: "iniciar",
	reiniciar: "reiniciar",
	pausar: "pausar",
	parar: "parar"
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
	#_temporizador;
	#barra;
	//Lista de objetos (jogador/inimigo/itens) do jogo
	#indJogadores;
	#indInimigos;
	#indItens;
	#listaSprites;	
	//Eventos da classe Tela
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

		this.#iniciarTemporizador();	
		
		
	}

	//Getters e Setters da classe Tela.
	get temporizador(){
		return this.#_temporizador;
	}
	
	get contextoTela(){
		return this.#ctx;
	}

	get altura(){
		return this.#_altura;
	}
	
	get largura(){
		return this.#_largura;
	}
	
	
	
	#iniciarTemporizador(){		
		this.#_temporizador = new Temporizador();		
		
		document.addEventListener("disparoQuadro",function(){ //loop principal			
			//this.desenharTela();
			//console.log(this.#_temporizador.quadroAtual);
			this.rodando();
		}.bind(this),false);	
		
		document.addEventListener("disparoCemMili",function(){ //loop principal		
			//console.debug(this.#_temporizador.intervaloCemMili);			
			this.desenharTela();			
		}.bind(this),false);
		
	}	
		
	//Metodo responsavel em desenhar a tela do jogo
	desenharTela(){
		this.#ctx.reset();
		this.#tela.dispatchEvent(this.#evtDesenharHUD);
		this.#tela.dispatchEvent(this.#evtDesenharSprites);						
	}
	
	rodando(callback){
		document.addEventListener("disparoQuadro",function(){ //loop principal			
			//this.desenharTela();
			//console.log(this.#_temporizador.quadroAtual);
			callback;
		}.bind(this),false);
	}	

}

//Classe do Temporizador
class Temporizador {
	//Propriedades do temporizador	
	#_temporizador1;
	#_temporizador2;
	//Atributos do temporizador
	#qps;
	#quadros = 0;
	#intervaloCemMili = 0;	
	//Eventos do temporizador
	#evtDisparoQuadro;
	#evtDisparoCemMili;
	#evtDisparoSegundo;
	
	constructor(){
		this.#evtDisparoQuadro = new CustomEvent("disparoQuadro",{detail: "Um Quadro foi atualizado",bubbles: true, cancelable: true});
		this.#evtDisparoCemMili = new CustomEvent("disparoCemMili",{detail: "Cem milisegundos foi atualizado",bubbles: true, cancelable: true});
		this.#evtDisparoSegundo = new CustomEvent("disparoSegundo",{detail: "Um segundo foi atualizado",bubbles: true, cancelable: true});	
		
		this.#_temporizador1 = setInterval(function(){
			document.dispatchEvent(this.#evtDisparoQuadro);
			if(this.#quadros>=0 && this.#quadros<59){
				this.#quadros += 1;
			}else{
				document.dispatchEvent(this.#evtDisparoSegundo);
				this.#quadros = 0;
			}
			
		}.bind(this),16.6);
		
		this.#_temporizador2 = setInterval(function(){
			document.dispatchEvent(this.#evtDisparoCemMili);
				if(this.#intervaloCemMili>=0 && this.#intervaloCemMili<1000){
					this.#intervaloCemMili += 100;
				}else{
					//document.dispatchEvent(this.#evtDisparoSegundo);
					this.#intervaloCemMili = 0;
					
				}			
		}.bind(this),100);
		
	}
	
	//Getters e Setters do temporizador
	get quadroPorSegundo(){
		return this.#qps;
	}
	
	get quadroAtual(){
		return this.#quadros;
	}
	
	get intervaloCemMili(){
		return this.#intervaloCemMili;
	}
	
	
	//Metodos do temporizador
	CicloQPS(callback){
		document.addEventListener("disparoQuadro",callback.bind(this),false);
	}
	
	Ciclo1Seg(callback){
		document.addEventListener("disparoSegundo",callback.bind(this),false);
	}
	
	Ciclo100Mili(callback){
		document.addEventListener("disparoCemMili",callback.bind(this),false);
	}

}

//Classe inicialização dos controles
class Controle {
	
	#comando;
	#tecla;
		
	constructor(objeto){
		console.log("Objeto 'Controle' foi criado.");	
		
		this.#comando = [
			{tecla: 'ArrowUp', estado: 'up', acao: ()=>{objeto.movimentoCima()}},
			{tecla: 'ArrowDown', estado: 'up', acao: ()=>{objeto.movimentoBaixo()}},
			{tecla: 'ArrowLeft', estado: 'up', acao: ()=>{objeto.movimentoEsquerda()}},
			{tecla: 'ArrowRight', estado: 'up', acao: ()=>{objeto.movimentoDireita()}},
			{tecla: 'KeyZ', estado: 'up', acao: ()=>{console.log("Z")}},
			{tecla: 'KeyX', estado: 'up', acao: ()=>{console.log("X")}},
			{tecla: 'Shiftleft', estado: 'up', acao: ()=>{console.log("ShiftEsquerdo")}},
			{tecla: 'ControlLeft', estado: 'up', acao: ()=>{console.log("ControlEsquerdo")}},
			{tecla: 'Space', estado: 'up', acao: ()=>{objeto.movimentoTiro()}}		
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
		
		document.addEventListener("disparoQuadro",function(){
			
			this.#comando.forEach((obj,indice,array) => {
				if(obj.estado == "down"){
					obj.acao();					
				}
			});
			
			
		}.bind(this),false);		
		
	}	
	
}

class Relogio {
	//Propriedades
	#_relogio;
	//Atributos
	#horas;
	#minutos;
	#segundos;
	
	
	constructor(){
		this.#_relogio = "00:00:00";		
		this.#horas = 0;
		this.#minutos = 0;
		this.#segundos = 0;
		
		let h;
		let m;
		let s;			
		
		document.addEventListener("disparoSegundo",function(){ //Evento de captura dos segundos do temporizador
		
		if(this.#segundos>=0 && this.#segundos<59){ //Atualização dos segundos
			
			s = this.#segundos.toLocaleString('pt-BR', {
			  minimumIntegerDigits: 2, 
			  useGrouping: false
			});
			
			m = this.#minutos.toLocaleString('pt-BR', {
				  minimumIntegerDigits: 2, 
				  useGrouping: false
				});
				
			h = this.#horas.toLocaleString('pt-BR', {
			  minimumIntegerDigits: 2, 
			  useGrouping: false
			});
			
			this.#segundos += 1;
			
		}else{
			
			s = this.#segundos.toLocaleString('pt-BR', {
			  minimumIntegerDigits: 2, 
			  useGrouping: false
			});	

			m = this.#minutos.toLocaleString('pt-BR', {
				  minimumIntegerDigits: 2, 
				  useGrouping: false
				});
				
			h = this.#horas.toLocaleString('pt-BR', {
			  minimumIntegerDigits: 2, 
			  useGrouping: false
			});
			
			if(this.#minutos>=0 && this.#minutos<59){ //Atualização dos minutos
				
				this.#minutos += 1;				
				
			}else{	

				if(this.#horas>=0 && this.#horas<23){ //Atualização das horas
				
					this.#horas += 1;				
				
				}else{				
					
					this.#horas = 0;
					
				}
				
				this.#minutos = 0;
				
			}
			
			this.#segundos = 0;
			
		}			
			
			this.#_relogio = h + ":" + m + ":" + s;
						
		}.bind(this),false);
		
		
	}
	
	//Metodos da classe Relogio
	
	mostrarRelogio(){	
		
		return	this.#_relogio;	
		
	}
}

class Cronometro {
	//Propriedades da classe cronometro
	#_cronometro;
	#_estado;
	//Atributos	
	#segundos;
	#valor;
	//Eventos da classe
	#evtCronometroRodando;
	#evtCronometroPausado;
	#evtCronometroParado;
	#evtCronometroReiniciado;
	
	
	constructor(valor){
					
		this.#segundos = valor;
		this.#_cronometro = this.#segundos.toLocaleString('pt-BR', {
					  minimumIntegerDigits: 3, 
					  useGrouping: false
					}) + "s";
		this.#valor = valor;
		this.#_estado = "0";
		
		
		this.#evtCronometroRodando = new CustomEvent("cronometroRodando",{detail: "O cronometro esta em andamento",bubbles: true, cancelable: true});
		this.#evtCronometroPausado = new CustomEvent("cronometroPausado",{detail: "O cronometro esta pausado",bubbles: true, cancelable: true});
		this.#evtCronometroParado = new CustomEvent("cronometroParado",{detail: "O cronometro esta parado",bubbles: true, cancelable: true});
		this.#evtCronometroReiniciado = new CustomEvent("cronometroReiniciado",{detail: "O cronometro foi reiniciado",bubbles: true, cancelable: true});	
		
		let s;			
		
		document.addEventListener("disparoSegundo",function(){ //Evento de captura dos segundos do temporizador
		
		
		
		if(this.#segundos>=1 && this.#segundos<=valor){ //Atualização dos segundos
		
					this.#segundos -= 1;
			
					s = this.#segundos.toLocaleString('pt-BR', {
					  minimumIntegerDigits: 3, 
					  useGrouping: false
					});
										
					document.dispatchEvent(this.#evtCronometroRodando);	
					
				}else{
					
					this.#segundos = 0;
					
					s = this.#segundos.toLocaleString('pt-BR', {
					  minimumIntegerDigits: 3, 
					  useGrouping: false
					});					
					
					document.dispatchEvent(this.#evtCronometroParado);	
					
				}			
					
					this.#_cronometro = s + "s";
		
		
						
		}.bind(this),false);
		
		
	}
	
	
	//Metodos da classe cronometro
	
	parar(){
		this.#segundos = 0;
	}
	
	reiniciar(){
		this.#segundos = this.#valor;
	}
	
	mostrarCronometro(){	
		
		return	this.#_cronometro;	
		
	}
	
	
}

//Classe de tratamento de colisões
class Colisao {
	
	#objColisao;
	#listaAcoes;
	constructor(jog){
		this.#objColisao = [];
		this.#listaAcoes = new ListaAcoes();		
		document.addEventListener("disparoQuadro",function(){
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


//Classe base para texto
class Texto {
	//Atributos	da classe texto	
	#_posX = 0;
	#_posY = 0;
	#_corTexto;
	#_tamanhoTexto = 10;
	#_texto;
	
	//Construtor da classe texto
	constructor(){					
		this.#_texto = "Texto Aqui";
	}
	
	
	//Getters e Setters da classe texto
	get texto(){		
		return this.#_texto;
	}
	
	set texto(valor){
		this.#_texto = valor;		
	}
	
	get tamanhoTexto(){
		return this.#_tamanhoTexto + "px Arial Black";
	}
	
	set tamanhoTexto(tamanho){
		this.#_tamanhoTexto = tamanho;
	}

	get posX(){
		return this.#_posX;
	}
	
	set posX(valor){
		this.#_posX = valor;
	}
	
	get posY(){
		return this.#_posY;
	}
	
	set posY(valor){
		this.#_posY = valor;
	}
	
	//Metodos
	posicaoXY(posX,posY){
		this.#_posX = posX;
		this.#_posY = posY;
	}
}

//Classe TextoPlacar
class TextoPlacar extends Texto {
	//Atributos
	#ctx;
	
	//Construtor
	constructor(ctx,posX,posY){
		super();
		super.posX = posX;
		super.posY = posY;
		this.#ctx = ctx;
		this.desenhar();		
		
		console.info("Objeto 'TextoPlacar' foi criado");
		
		document.addEventListener("desenharHUD",function(e){
			this.desenhar();
		}.bind(this));
	}
	
	//Getters e Setters
	
	//Metodos
	
	desenhar(){		
		this.#ctx.fillStyle = "black";
		this.#ctx.font = super.tamanhoTexto;
		this.#ctx.fillText(super.texto,super.posX,super.posY);		
	}
}


//Classe Texto Relogio
class TextoRelogio extends Texto {
	//Atributos
	#ctx;
	#relogio;
	
	//Construtor
	constructor(ctx,posX,posY){
		super();
		super.posX = posX;
		super.posY = posY;
		this.#ctx = ctx;
		this.#relogio = new Relogio();
		this.desenhar();
		
		console.log("Objeto 'textoRelogio' foi criado");
		
		document.addEventListener("desenharHUD",function(e){
			this.desenhar();
		}.bind(this));
	}
	
	//Getters e Setters
	
	//Metodos
	
	desenhar(){		
		this.#ctx.fillStyle = "black";
		this.#ctx.font = super.tamanhoTexto;
		this.#ctx.fillText(this.#relogio.mostrarRelogio(),super.posX,super.posY);		
	}
	
}

//Classe Texto Relogio
class TextoCronometro extends Texto {
	//Atributos
	#ctx;
	#cronometro;
	#img;
	
	//Construtor
	constructor(ctx,valor,posX,posY){
		super();
		super.posX = posX;
		super.posY = posY;
		this.#ctx = ctx;
		this.#img = new Image(12,12);
		this.#img.onload = ()=>{
			this.#ctx.drawImage(this.#img,super.posX-12,super.posY-9);	
			console.log("Imagem do cronometro foi carregada");
		} 
		this.#img.src = "assets/img/cronometro.png";
		this.#cronometro = new Cronometro(valor);
		this.desenhar();
		
		console.log("Objeto 'textoCronometro' foi criado");
		
		document.addEventListener("desenharHUD",function(e){
			this.desenhar();
		}.bind(this));
	}
	
	//Getters e Setters
	
	//Metodos
	
	desenhar(){
		this.#ctx.drawImage(this.#img,super.posX-12,super.posY-9);				
		this.#ctx.font = super.tamanhoTexto;
		this.#ctx.fillStyle = "black";	
		this.#ctx.fillText(this.#cronometro.mostrarCronometro(),super.posX,super.posY);	
			
	}
	
}

//Classe base para as barras do HUD
class Barra {
	//Metodos e atributos
	#_min;
	#_max;
	#valor;
	
	constructor(){		
		this.#_min = 0;
		this.#_max = 100;
		this.#valor = 100;
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
		
		console.log("Objeto 'barra de vida' foi criado");
		
		document.addEventListener("desenharHUD",function(e){
			this.desenhar();
		}.bind(this));
		
	}
	
	desenhar(){
		this.#ctx.fillStyle = "black";
		this.#ctx.strokeRect(this.#_posX,this.#_posY,super.limiteMaximo,this.#_altura);
		this.#ctx.fillStyle = "green";
		this.#ctx.fillRect(this.#_posX,this.#_posY,super.valor,this.#_altura);
	}	
	
	
	posicaoXY(posX,posY){
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

class Animacao {
	
	
	
}

//Classe base de sprites
class Objeto {
	//Propriedades
	#id;
	#tipo = "Objeto";
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
	#visibilidade;
	//Eventos da classe Objeto	
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
		this.#visibilidade = true;
		
		this.#evtSpriteMovimento = new CustomEvent(this.#tipo + "Movimento",{detail: "Sprite em movimento",bubbles: true, cancelable: true});
		this.#evtSpriteTiro = new CustomEvent(this.#tipo + "Tiro",{detail: "Sprite atirou",bubbles: true, cancelable: true});
		this.#evtSpriteDestruir = new CustomEvent(this.#tipo + "Destruido",{detail: "Sprite foi destruido",bubbles: true, cancelable: true});
		
		this.desenhar();
		
		console.log("Objeto sprite '" + this.#id + "' foi criado.");
		
		document.addEventListener("desenharSprites",function(e){
			if(this.#visibilidade){				
				this.desenhar();				
			}			
		}.bind(this));
				
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
	
	get visibilidade(){
		return this.#visibilidade;
	}

	set tipo(tipo){
		this.#tipo = tipo;
	}
	
	set cor(cor){
		this.#cor = cor;
	}
	
	set posX(posX){
		this.#posX = posX;
	}
	
	set posY(posY){
		this.#posY = posY;
	}
	
	set tamanho(tamanho){
		this.#altura = tamanho;
		this.#largura = tamanho;
	}
	
	set velocidade(velocidade){
		this.#velocidade = velocidade;
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
			this.#posX = this.#posX - this.#velocidade;
			this.#tela.dispatchEvent(this.#evtSpriteMovimento);
		}else{
			this.#posX = 0;
		}		
	}
	
	movimentoBala(){
		
		if(this.#posY > 0){
			this.#visibilidade = true;
			this.#posY = this.#posY - this.#velocidade;
			this.#tela.dispatchEvent(this.#evtSpriteMovimento);			 
		}else{
			this.#posY = 0;
			this.#visibilidade = false;
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
class Jogador extends Objeto {
	
	#bala;
	#emMov;
	
	constructor(id,ctx,posX,posY,tamanho){
		super(id,ctx,posX,posY,tamanho);
		this.tipo = "jogador";		
		this.#emMov = false;		
	}

	desenhar(){
		super.desenhar();
		document.addEventListener("projetilDestruido",function(){
			this.#emMov = false;			
		}.bind(this),false);
	}
	
	movimentoTiro(){
		if(this.#emMov==false){
			this.#bala = new Projetil("bala",super.ctx,super.posX+3,super.posY);		
			this.#emMov = true;
		}
			
			
		
	}
	
}

//Classe Inimigo
class Inimigo extends Objeto {	
	
	constructor(id,ctx,posX,posY,tamanho){
		super(id,ctx,posX,posY,tamanho);
		super.cor = "red";
		super.tipo = "inimigo";
	}	
	
}

class Projetil extends Objeto {
	
	#evtProjetilDestruido;
	
	constructor(id,ctx,posX,posY,tamanho=4){		
		super(id,ctx,posX,posY,tamanho);
		this.tipo = "projetil";			
		this.#evtProjetilDestruido = new CustomEvent("projetilDestruido",{detail: "O projetil foi destruido", bubbles: true, cancelable: true});		
	}
	
	desenhar(){	
		super.desenhar();		
		this.movimentoBala();
		if(this.visibilidade==false){
					
			document.dispatchEvent(this.#evtProjetilDestruido);
		}		
	}	
	
}

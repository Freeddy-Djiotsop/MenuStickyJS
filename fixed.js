/*(function()
{
    //scrollY nous aide a sauveguarder le nbre de pixel en Y cad le fonction de la largeur de la fenetre en descendant ou en montant, donc qnd la page vient de s'actualiser c egale a 0, si on descend xa va s'incrementer
    var scrollY = function()
    {
        var supportPageOffset = window.pageXOffset !== undefined;
        var isCSS1Compat = ((document.compatMode || "") === "CSS1Compat");
        
        return supportPageOffset ? window.pageYOffset : isCSS1Compat ? document.documentElement.scrollTop : document.body.scrollTop;
    };
    
    var elements = document.querySelectorAll("[data-sticky]");
    for(var i=0; i<elements.length; i++)
    {
        (function(element)
        {
            //lorsqu'on scrolle
            //si le menu sort de l'ecran
                //alors il doit devenir fixe

            //var element = document.querySelector(".menu");

            //document.querySelector(".menu").getBoundingClientRect() a les valeur comme top, width etc.. de l'element de la classe .menu
            var rect = element.getBoundingClientRect();
            
            var offset = parseInt(element.getAttribute("data-offset")||0,10); //si la gauche est defini prends sa valeur converti en int sinon soit egale a 0 en base 10
            
            var top = rect.top + scrollY;
            //var width = rect.width;

            //il nous aide a fixe le text qui est juste en bas du menu, si on l'enleve le text sera cache sous le menu, en ajoutant donc un elemnt qui est fake avec les mm proprite que notre menu il s'y cache tjrs sauf puisq notre fake element n'existe pas on peut voir clairement notre text
            var fake = document.createElement("div");
            fake.style.width = rect.width + "px";
            fake.style.height = rect.height + "px";

            //les function debut

            //cette fonction position nous element comme on veut mm qnd on a scrolle
            var onScroll = function()
            {
                var hasScrollClass = element.classList.contains("fixed");//return true si element a deja la class fixe, sinon false, l'importancee de faire ceci et d'ajouter dans la condiction est que les condiction if et if else ne seront que une et une seul fois, pourtant sil n'est pas la a chaque fois que scroll sera > top il essaiera de faire le code
                if( scrollY()>(top- offset)&& !hasScrollClass)//si c > a top c que top est entrain de disparaitre de la fenetre
                {
                    element.classList.add("fixed");//On lui ajoute la class fixed et on travaille avec dans le css
                    
                        //Ou bien on peut faire
                        //element.style.position = "fixed";
                        //element.style.top = "  ";
                    
                    
                    element.style.top = offset + "px";
                    element.style.width = rect.width + "px";//il faut tjrs donner l'unite qui est le px;
                    element.parentNode.insertBefore(fake,element);//on insert donc fake avant le menu et ne pas oublie d'enlever fake dans le else
                }
                else if(scrollY() > (top- offset) && hasScrollClass)
                {
                    element.classList.remove("fixed");
                    element.parentNode.removeChild(fake);
                }


            };

            //Lorsqu'on redimension la fenetre j'appelle cette function
            var onResize = function()
            {
                element.style.width = "auto";//Pr kil ait la bonne longeur mm si nous a eu l'a modifier avant dans le code
                element.classList.remove("fixed");
                fake.style.display = "none";
                //important d'annuler tout ce qui a pu etre fait, avant de recalculer

                rect = element.getBoundingClientRect();//il nous renvoie les nvlles valeurs qui nous permet de tout remettre en odre dans la page
                top = rect.top + scrollY;
                fake.style.width = rect.width + "px";
                fake.style.display = "block";
                onScroll();
            };
    
    
            //fin des function
            
            //Listener
            window.addEventListener("scroll", onScroll)
    
            window.addEventListener("resize", onResize);
        })(elements[i]);
    }
    
    
    
    
})();*/

(function()//Ici logo est juste change par logo de ... lorsque la page finit de charger
{
    var endOfLoading = function()
    {
        document.querySelector("div.topbar").innerHTML = "LOGO DE FREEDDY";
    };
    document.addEventListener('DOMContentLoaded', endOfLoading, false);
})();

(function()
{
    //window.scrollY fonctionne aussi sans pb sauf que sur certains anciens navigauateur xa ne donne pas or ce code donnera scrollY dans touts les navigateur
    var scrollY = function()
    {
        var supportPageOffset = window.pageXOffset !== undefined;
        var isCSS1Compat = ((document.compatMode || "") === "CSS1Compat");
        
        return supportPageOffset ? window.pageYOffset : isCSS1Compat ? document.documentElement.scrollTop : document.body.scrollTop;
    };
    
    
    var menu = document.querySelector("div.menu");
    var rect = menu.getBoundingClientRect();
    var menuTop = rect.top + scrollY();//la valeur initiale de menuTop enfait
    /*En fait il ya une astuce derriere, c que lorskon depasse le menu son top devient negativ, donc on aura tjrs le top innitiale de notre menu qnd on a pas scrolle mm qnd on a scrolle, je sais que tu auras les difficultes a comprendre ceci que tu as ecrit quelque jrs plustard :)*/
    
    var menuWidth = rect.width;//puisque mon element perds sa largeur lorsqu'il devient fixe, je la sauvegarder pour la lui redonner. je pouvais aussi le faire dans le css
    
    var fake = document.createElement("div");//Notre faux element
    //on cree une div et on lui donne toutes les proprite de menu
    fake.style.width = rect.width + "px";
    fake.style.height = rect.height + "px";
    fake.style.marginTop = rect.marginTop + "px";
    //Maintenant on va l'ajoute dans la onScroll, mais on est aussi obliger de creer une autre function onResize pour avoir le controle mm qnd la page est resize
    var onScroll = function()
    {
        //Puisque cette fonction sera appele toutes les fois ou on va scrolle, il est conseillé d'ajoute une seconde condition qui empechera que ce que nous voulions faire se refasse mm qnd ce fut deja fait, d'ou hasFixed
        
        var hasFixed = menu.classList.contains("fixed");//check if fixed already a class name and return a boolean
        if(scrollY() > menuTop && !hasFixed)
        {
            menu.classList.add("fixed");
            menu.style.width = menuWidth + "px";//voila comment on accede au propriete css d'un element en js, .innerHTLM pour changer son text du html
            
            //Qnd ceci est fait on constate que le changement de position de notre menubar se remarque trop, on aimerait le faire un peu plus discretement c prkw on cree un faux element(fake) qui restera a la plade notre menu qnd on le rend fixe ainsi le changement de position de notre menu ne se sentire mm plus. 
            //sa deklaratio est avant la fonction, ici c juste l'ajout et dans le else on va le supprimer
            
            menu.parentNode.insertBefore(fake,menu);//on insere fake juste avant menu dans le body, body qui le parentNode
        }
        else if(scrollY() < menuTop && hasFixed)
        {
            menu.classList.remove("fixed");
            menu.parentNode.removeChild(fake);//et il es retirer
        }
        
        
    }
    
    var onResize = function()
    {
        //on defait si a ete fait ou a pu etre fait
        menu.style.width = 100+"%";//on suppose que ds le css on pas tenu compte du resize pour sa valeur du coup on y va prudement
        menu.classList.remove("fixed");//
        fake.style.display = "none";//premierement on rend notre fake invisible
        
        //Fin du defaire
        
        
        //On refait le calcul maintenant que le windows a ete redimensione
        rect = menu.getBoundingClientRect();
        menuTop = rect.top + scrollY();
        fake.style.width = rect.width + "px";
        fake.style.height = rect.height + "px";
        fake.style.marginTop = rect.marginTop + "px";
        //Fin du calcul
        
        //On place maintenant nos element comme on veut
        fake.style.display = "block";
        onScroll;
        //Fin du placement
        
        
    }
    
    window.addEventListener("scroll", onScroll); 
    window.addEventListener("resize", onResize);//Pour controler la position de nos element mm quand on a resize
    
})();
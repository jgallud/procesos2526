function Sistema(){
 this.usuarios={};
 
 this.agregarUsuario=function(nick){
   let res={"nick":-1};
   if (!this.usuarios[nick]){
   this.usuarios[nick]=new Usuario(nick);
   res.nick=nick;
   }
   else{
   console.log("el nick "+nick+" está en uso");
   }
   return res;
 }
 
 this.obtenerUsuarios=function(){
   let lista=[];
   for (let u in this.usuarios){
     lista.push({"nick":this.usuarios[u].nick});
   }
   return lista;
   //return this.usuarios; ;
 }

 this.usuarioActivo=function(nick){
    return this.usuarios[nick]!=undefined;
 }

 this.eliminarUsuario=function(nick){
   res={"nick":-1};
   if (this.usuarios[nick]){
     delete this.usuarios[nick];
     res.nick=nick;  
   }
   return res;
 }

 this.numeroUsuarios=function(){
   return Object.keys(this.usuarios).length;
 }
}

function Usuario(nick){
 this.nick=nick;
}

module.exports.Sistema=Sistema;

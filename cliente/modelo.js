function Sistema(){
 this.usuarios={};
 
 this.agregarUsuario=function(nick){
 this.usuarios[nick]=new Usuario(nick);
 }
 
 this.obtenerUsuarios=function(){
 return this.usuarios;
 }

 this.usuarioActivo=function(nick){
    return this.usuarios[nick]!=undefined;
 }

 this.eliminarUsuario=function(nick){
    delete this.usuarios[nick];
 }
}

function Usuario(nick){
 this.nick=nick;
}

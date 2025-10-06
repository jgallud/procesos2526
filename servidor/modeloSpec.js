const modelo = require("./modelo.js");
describe('El sistema...', function() {
    let sistema;
    beforeEach(function() {
        sistema=new modelo.Sistema();
    });

    it('...puede agregar un usuario', function() {
        sistema.agregarUsuario("pepe");
        let usuarios=sistema.obtenerUsuarios();
        expect(usuarios["pepe"].nick).toBe("pepe");
    });
    it('...puede verificar si un usuario está activo', function() {
        sistema.agregarUsuario("pepe");
        expect(sistema.usuarioActivo("pepe")).toBe(true);
        expect(sistema.usuarioActivo("juan")).toBe(false);
    });
    it('...puede eliminar un usuario', function() {
        sistema.agregarUsuario("pepe");
        expect(sistema.usuarioActivo("pepe")).toBe(true);
        sistema.eliminarUsuario("pepe");
        expect(sistema.usuarioActivo("pepe")).toBe(false);
    }); 
});
// toggleSidebar.js
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar-container');
    const content = document.getElementById('content-container');
    const mainHeader = document.querySelector('.main-header');
    const menuIcon = document.getElementById('menu-icon'); // El icono de menú único

    if (sidebar && content && mainHeader) {
        // Alterna las clases de estilo para el sidebar y el contenido
        sidebar.classList.toggle('open');
        content.classList.toggle('expanded');
        mainHeader.classList.toggle('expanded');

        // Cambia el icono al hacer clic
        if (sidebar.classList.contains('open')) {
            menuIcon.textContent = '✕'; // Cambia el icono a una "X" para cerrar
        } else {
            menuIcon.textContent = '☰'; // Cambia el icono a "☰" para abrir
        }
    } else {
        console.error("No se encontraron los elementos sidebar, content o mainHeader.");
    }
}
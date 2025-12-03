// js/email-handler.js

(function() {
    // Tu Public Key real
    emailjs.init("74nW3KMDc029QfNXV"); 
})();

/**
 * Función maestra para enviar formularios
 */
function handleFormSubmit(config) {
    const form = document.getElementById(config.formId);
    const btn = document.getElementById(config.btnId);

    if (form) {
        form.addEventListener('submit', function(event) {
            event.preventDefault();

            const originalBtnText = btn.innerText;
            btn.innerText = 'Procesando...';
            btn.disabled = true;

            // 1. Enviar correo al ADMIN (Usando tu plantilla de contacto/general)
            emailjs.sendForm(config.serviceId, config.templateAdmin, this)
                .then(function() {
                    
                    // 2. Si es una reserva, enviar confirmación al CLIENTE
                    if (config.templateClient) {
                        return emailjs.sendForm(config.serviceId, config.templateClient, form);
                    }
                    return Promise.resolve();
                })
                .then(function() {
                    // ÉXITO
                    alert(config.successMessage);
                    btn.innerText = '¡Enviado!';
                    btn.classList.remove('btn-outline-secondary', 'btn-reservar'); // Quita clases viejas
                    btn.classList.add('btn-success'); // Pone color verde
                    form.reset();
                    
                    setTimeout(() => {
                        btn.innerText = originalBtnText;
                        btn.disabled = false;
                        btn.classList.remove('btn-success');
                        btn.classList.add(config.btnClassOriginal || 'btn-primary'); // Restaura estilo
                    }, 3000);

                }, function(error) {
                    // ERROR
                    console.error('Error EmailJS:', error);
                    alert('Hubo un error al enviar. Por favor intenta nuevamente.');
                    btn.innerText = originalBtnText;
                    btn.disabled = false;
                });
        });
    }
}

document.addEventListener('DOMContentLoaded', function() {
    
    // --- CONFIGURACIÓN RESERVA ---
    // Envía aviso a TI + confirmación al CLIENTE
    handleFormSubmit({
        formId: 'form-reserva',
        btnId: 'btn-submit-reserva',
        serviceId: 'service_tf1ocwq',
        
        // A TI: Te avisa que hay reserva (usando la plantilla "contacto" como maestra)
        templateAdmin: 'template_nk7kot8', 
        
        // AL CLIENTE: Le confirma su reserva
        templateClient: 'template_241feds', 
        
        successMessage: '¡Solicitud recibida! Te hemos enviado un correo de confirmación.',
        btnClassOriginal: 'btn-reservar'
    });

    // --- CONFIGURACIÓN CONTACTO ---
    // Envía aviso SOLO A TI
    handleFormSubmit({
        formId: 'form-contacto',
        btnId: 'btn-submit-contacto',
        serviceId: 'service_tf1ocwq',
        
        // A TI: Te avisa del mensaje
        templateAdmin: 'template_nk7kot8', 
        
        // AL CLIENTE: No enviamos nada extra (null)
        templateClient: null, 
        
        successMessage: 'Mensaje enviado correctamente.',
        btnClassOriginal: 'btn-outline-secondary'
    });
});
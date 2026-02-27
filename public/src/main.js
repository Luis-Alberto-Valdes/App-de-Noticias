// Validación de formularios

document.addEventListener('DOMContentLoaded', function () {
  const form = document.querySelector('.login-form')

  if (form) {
    // Remover validación HTML5 por defecto
    form.noValidate = true

    form.addEventListener('submit', function (e) {
      e.preventDefault()
      e.stopPropagation()
      validarFormulario()
    }, true) // Usar captura para asegurar que se ejecute primero
  }

  // Remover error cuando el usuario hace focus
  const inputs = document.querySelectorAll('.form-input')
  inputs.forEach(input => {
    input.addEventListener('focus', function () {
      this.classList.remove('input-error')
      const errorMessage = this.parentElement.querySelector('.error-message')
      if (errorMessage) {
        errorMessage.remove()
      }
    })
  })
})

// Función principal de validación
function validarFormulario () {
  const email = document.getElementById('email')
  const password = document.getElementById('password')
  const passwordConfirm = document.getElementById('password-confirm')
  const categoriesGrid = document.querySelector('.categories-grid')

  // Validar que los elementos existan
  if (!email || !password) {
    return false
  }

  let esValido = true

  // Limpiar errores previos
  limpiarErrores()

  // Validar email
  if (!validarEmail(email.value)) {
    mostrarError(email, 'Please enter a valid email')
    esValido = false
  }

  // Validar contraseña
  if (!validarPassword(password.value)) {
    mostrarError(password, 'Password must be at least 6 characters')
    esValido = false
  }

  // Validar confirmación de contraseña si existe el campo
  if (passwordConfirm) {
    if (!passwordConfirm.value) {
      mostrarError(passwordConfirm, 'Please confirm your password')
      esValido = false
    } else if (!validarPasswordMatch(password.value, passwordConfirm.value)) {
      mostrarError(passwordConfirm, 'Passwords do not match')
      esValido = false
    }
  }

  // Validar categorías si existen
  if (categoriesGrid) {
    const checkboxes = categoriesGrid.querySelectorAll('input[type="checkbox"]:checked')
    if (checkboxes.length === 0) {
      mostrarErrorCategoria('You must select at least one category')
      esValido = false
    }
    if (checkboxes.length > 5) {
      mostrarErrorCategoria('You can select a maximum of 5 categories')
      esValido = false
    }
  }
  if (esValido) {
    enviarDatos()
  }

  return esValido
}

// Funciones de validación
function validarEmail (email) {
  const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return regexEmail.test(email) && email.trim() !== ''
}

function validarPassword (password) {
  return password.length >= 6 && password.length <= 30 && password.trim() !== ''
}

function validarPasswordMatch (password, passwordConfirm) {
  return password === passwordConfirm && password.trim() !== ''
}

function mostrarError (elemento, mensaje) {
  elemento.classList.add('input-error')

  // Buscar el .form-group para agregar el mensaje de error
  const formGroup = elemento.closest('.form-group')
  let errorElement = formGroup.querySelector('.error-message')
  if (!errorElement) {
    errorElement = document.createElement('span')
    errorElement.className = 'error-message'
    formGroup.appendChild(errorElement)
  }

  errorElement.textContent = mensaje
}

function mostrarErrorCategoria (mensaje) {
  const categoriesGrid = document.querySelector('.categories-grid')
  let errorElement = categoriesGrid.parentElement.querySelector('.error-message')

  if (!errorElement) {
    errorElement = document.createElement('span')
    errorElement.className = 'error-message'
    categoriesGrid.parentElement.appendChild(errorElement)
  }

  errorElement.textContent = mensaje
}

function limpiarErrores () {
  const inputs = document.querySelectorAll('.form-input')
  inputs.forEach(input => input.classList.remove('input-error'))

  const errors = document.querySelectorAll('.error-message')
  errors.forEach(error => error.remove())
}

function mostrarMensaje (mensaje, tipo = 'success') {
  const alerta = document.createElement('div')
  alerta.className = `alert alert-${tipo}`
  alerta.textContent = mensaje

  const form = document.querySelector('.login-form')
  if (form && form.parentElement) {
    form.parentElement.insertBefore(alerta, form)
  }

  setTimeout(() => {
    alerta.remove()
  }, 10000)
}

// Remover error cuando el usuario hace focus
document.addEventListener('DOMContentLoaded', function () {
  const inputs = document.querySelectorAll('.form-input')
  inputs.forEach(input => {
    input.addEventListener('focus', function () {
      this.classList.remove('input-error')
      const errorMessage = this.parentElement.querySelector('.error-message')
      if (errorMessage) {
        errorMessage.remove()
      }
    })
  })
})

function enviarDatos () {
  const email = document.getElementById('email').value
  const password = document.getElementById('password').value
  const pageTitle = document.title
  const isSuscribe = pageTitle.includes('Suscribe')
  const method = isSuscribe ? 'POST' : 'DELETE'

  // Preparar los datos a enviar
  const datos = {
    email,
    password
  }

  // Si es suscribe, agregar las categorías
  if (isSuscribe) {
    const categoriesSelected = document.querySelectorAll('.categories-grid input[type="checkbox"]:checked')
    const categories = Array.from(categoriesSelected).map(checkbox => checkbox.value)
    datos.categories = categories
  }
  console.log(datos)

  // Enviar los datos al backend
  fetch('https://app-de-noticias-backend.onrender.com/noticias', {
    method,
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(datos)
  })
    .then(response => {
      if (response.ok) {
        const mensaje = isSuscribe ? 'Subscription successful revice your email for verification code!' : 'Unsubscribe successful!'
        mostrarMensaje(mensaje, 'success')
        // Limpiar el formulario después del envío exitoso
        document.querySelector('.login-form').reset()
      } else {
        return response.json().then(error => {
          throw new Error(error.message || 'Server is not available try again later')
        })
      }
    })
    .catch(error => {
      mostrarMensaje(error.message, 'error')
    })
}

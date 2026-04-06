# Blazor.Demo

## Descripción del componente CameraDrawComponent

`CameraDrawComponent` es un componente Blazor que permite:

- Iniciar la cámara web del usuario y mostrar el video en tiempo real.
- Capturar una foto y mostrarla en un lienzo (`canvas`).
- La integración se realiza mediante interoperabilidad con JavaScript, usando una clase JS personalizada.

### Estructura del componente

- **CameraDrawComponent.razor**: Define la interfaz con botones para iniciar la cámara y tomar la foto, y muestra el video y el canvas.
- **CameraDrawComponent.razor.cs**: Lógica C# para interactuar con JS, gestionar referencias y el ciclo de vida.
- **CameraDrawComponent.razor.js**: Implementa la clase JS que controla la cámara y el canvas.

### Uso básico

1. Agrega el componente en cualquier página o layout:
   
   ```razor
   <CameraDrawComponent />
   ```

2. Al hacer clic en "Iniciar camara", se solicita acceso a la cámara y se muestra el video.
3. Al hacer clic en "Tomar foto", la imagen actual del video se dibuja en el canvas.

### Interoperabilidad avanzada

- El componente importa dinámicamente el módulo JS y crea una instancia de la clase `CameraDrawComponent` en JS, pasando referencias al video y canvas.
- Se usa `TaskCompletionSource<IJSObjectReference>` para asegurar que los métodos JS estén disponibles antes de ser llamados, evitando errores si el usuario interactúa antes de que cargue el JS.

#### Ejemplo de integración JS:

```js
export class CameraDrawComponent {
	constructor(video, canvas) { /* ... */ }
	async startCamera() { /* ... */ }
	takePhoto() { /* ... */ }
	stopCamera() { /* ... */ }
	dispose() { /* ... */ }
}
```

## Próximos pasos

- Se agregará funcionalidad para pintar sobre la foto capturada en el canvas.
- Posteriormente, se podrá subir la imagen editada a una API.
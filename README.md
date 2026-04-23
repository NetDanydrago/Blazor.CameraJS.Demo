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

## Nuevas funcionalidades (Dibujo en canvas)

- Controles de pintura: se han añadido controles para seleccionar el **color** y el **grosor** del lápiz.
- Soporte de dibujo táctil y con ratón directamente sobre el `canvas` después de capturar la foto.
- El código JS ahora mantiene estado de dibujo (`isDrawing`, `penColor`, `penThickness`) y enlaza eventos de mouse/touch para `startDraw`, `draw` y `endDraw`.
- Métodos JS expuestos para interactuar desde C#:
	- `setPenColor(color)` — actualiza el color del lápiz.
	- `setPenThickness(thickness)` — actualiza el grosor del lápiz.
	- `bindCanvasEvents()` / `unbindCanvasEvents()` — (internos) asocian y eliminan handlers de eventos.

### Comportamiento de usuario

- Inicia la cámara y toma una foto como antes.
- Tras capturar la imagen, usa el selector de color y el deslizador de grosor para dibujar sobre el canvas.
- El dibujo funciona con ratón y con gestos táctiles (touchstart/touchmove/touchend).

### Notas de implementación

- En `CameraDrawComponent.razor` se añadieron los controles UI para color (`input type="color"`) y grosor (`input type="range"`).
- En `CameraDrawComponent.razor.cs` se exponen `OnPenColorChanged` y `OnPenThicknessChanged` que llaman a `setPenColor` y `setPenThickness` en el módulo JS cuando el canvas está inicializado.
- En `CameraDrawComponent.razor.js` se implementaron las funciones de dibujo, transformación de coordenadas (para escalar correctamente sobre el canvas) y el enlace/desenlace de eventos.

## Próximos pasos

- Añadir herramientas de edición adicionales (importar/guardar imagen).
- Posibilidad de exportar la imagen editada y subirla a una API.

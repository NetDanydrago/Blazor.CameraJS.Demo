using Microsoft.AspNetCore.Components;
using Microsoft.JSInterop;

namespace Blazor.Demo.Components;

public partial class CameraDrawComponent : IAsyncDisposable
{
    [Inject]
    public IJSRuntime JSRuntime { get; set; }

    private ElementReference VideoReference { get; set; }

    private ElementReference CanvasReference { get; set; }

    private TaskCompletionSource<IJSObjectReference> ModuleReferenceSource { get; set; }
    private TaskCompletionSource<IJSObjectReference> CameraDrawReferenceSource { get; set; }

    private bool IsCanvasInitialized { get; set; }
    private bool IsCameraActive { get; set; }

    public CameraDrawComponent()
    {
        ModuleReferenceSource = new();
        CameraDrawReferenceSource = new();
    }


    protected async override Task OnAfterRenderAsync(bool firstRender)
    {
        if (firstRender)
        {
            var moduleReference = await JSRuntime.InvokeAsync<IJSObjectReference>("import",
                                                       "./Components/CameraDrawComponent.razor.js");
            var cameraDrawReference = await moduleReference.InvokeConstructorAsync("CameraDrawComponent", 
                                          VideoReference, CanvasReference);

            ModuleReferenceSource.SetResult(moduleReference);
            CameraDrawReferenceSource.SetResult(cameraDrawReference);
            IsCanvasInitialized = true;
        }
    }

    private async Task StartCameraAsync()
    {
        if (!IsCameraActive)
        {
            IJSObjectReference cameraDrawReference = await CameraDrawReferenceSource.Task;
            await cameraDrawReference.InvokeVoidAsync("startCamera");
            IsCameraActive = true;
        }
    }

    private async Task TakePhotoAsync()
    {
        if (IsCameraActive && IsCanvasInitialized)
        {
            IJSObjectReference cameraDrawReference = await CameraDrawReferenceSource.Task;
            await cameraDrawReference.InvokeVoidAsync("takePhoto");
        }
    }

    public async ValueTask DisposeAsync()
    {
        if (IsCanvasInitialized)
        {
            IJSObjectReference cameraDrawReference = await CameraDrawReferenceSource.Task;
            IJSObjectReference moduleReference = await ModuleReferenceSource.Task;

            await cameraDrawReference.InvokeVoidAsync("dispose");
            await cameraDrawReference.DisposeAsync();
            await moduleReference.DisposeAsync();

            IsCameraActive = false;
        }
    }
}

export class ImageCrop {
    public static crop(image: HTMLImageElement, x: number, y: number, width: number, height: number): string {
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx!.drawImage(image, x, y, width, height, 0, 0, width, height);
        const result = canvas.toDataURL("image/png");
        canvas.remove();
        return result;
    }
}

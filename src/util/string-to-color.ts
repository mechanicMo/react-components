export const colorNameToRGB = (colorName: string) => {
    const d = document.createElement('div');
    d.style.color = colorName;
    document.body.append(d);

    // color in RGB
    const color = window.getComputedStyle(d).color;

    d.remove();

    return color;
};

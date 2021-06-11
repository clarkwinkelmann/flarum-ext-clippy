export default function (list: string[], baseValues: { [key: string]: string } = {}): { [key: string]: string } {
    const options = {...baseValues};

    list.forEach(value => {
        options[value] = value;
    });

    return options;
}

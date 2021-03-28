export default function (list, baseValues = {}) {
    const options = {...baseValues};

    list.forEach(value => {
        options[value] = value;
    });

    return options;
}

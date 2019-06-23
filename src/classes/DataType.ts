class DataType {
    set value(value: string) {
        this._value = value;
    }

    get value() {
        return this._value;
    }

    setValue(value: string) {
        this.value = value;
    }

    private _value: string = 'movie';
}

export default new DataType();

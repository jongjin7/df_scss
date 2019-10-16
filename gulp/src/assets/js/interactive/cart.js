class Cart{
    constructor(){
        this.cart = [111111];
        this.items = [{
            id: 1,
            name: 'Dove Soap',
            price: 39.99
        },{
            id: 2,
            name: 'Axe Deo',
            price: 99.99
        }];
    }


    getItems(){

        return this.items;
    }

    get firstName() {
        // getter는 반드시 무언가를 반환해야 한다.
        return this.items[0].name;
    }
}

const nameSpace = 'nameExp1'

export { Cart, nameSpace };
/**
 * Класс CreateTransactionForm управляет формой
 * создания новой транзакции
 * */
class CreateTransactionForm extends AsyncForm {

    get modalCode() {
        return this.element.id === 'new-income-form' ? 'newIncome' : 'newExpense';
    }

    /**
     * Вызывает родительский конструктор и
     * метод renderAccountsList
     * */
    constructor(element) {
        super(element);
        this.renderAccountsList();
    }

    /**
     * Получает список счетов с помощью Account.list
     * Обновляет в форме всплывающего окна выпадающий список
     * */
    renderAccountsList() {
        Account.list(null, (err, res) => {
            const select = this.element.querySelector('select');
            select.innerHTML = '';
            const list = res?.data?.map(item => `<option value="${item.id}">${item.name}</option>`);
            select.insertAdjacentHTML('beforeend', list);
        });
    }

    /**
     * Создаёт новую транзакцию (доход или расход)
     * с помощью Transaction.create. По успешному результату
     * вызывает App.update(), сбрасывает форму и закрывает окно,
     * в котором находится форма
     * */
    onSubmit(data) {
        Transaction.create(data, (err, res) => {
            if (res.success) {
                App.getModal(this.modalCode).close();
                this.reset();
                App.update();
            }
        });
    }
}

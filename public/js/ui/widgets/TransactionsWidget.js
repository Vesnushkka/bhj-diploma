/**
 * Класс TransactionsWidget отвечает за
 * открытие всплывающих окон для
 * создания нового дохода или расхода
 * */

class TransactionsWidget {

    #element;

    /**
     * Устанавливает полученный элемент
     * в свойство element.
     * Если переданный элемент не существует,
     * необходимо выкинуть ошибку.
     * */
    constructor(element) {
        if (!element) {
            throw new Error('Element must be provided!');
        }
        this.#element = element;
        this.registerEvents();
    }

    /**
     * Регистрирует обработчики нажатия на
     * кнопки «Новый доход» и «Новый расход».
     * При нажатии вызывает Modal.open() для
     * экземпляра окна
     * */
    registerEvents() {
        App.getModal('newIncome').bind(this.#element.querySelector('.create-income-button'));
        App.getModal('newExpense').bind(this.#element.querySelector('.create-expense-button'));
    }
}

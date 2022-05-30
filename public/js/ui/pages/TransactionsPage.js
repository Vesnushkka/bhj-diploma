/**
 * Класс TransactionsPage управляет
 * страницей отображения доходов и
 * расходов конкретного счёта
 * */
class TransactionsPage {

    #element;
    #lastOptions;

    /**
     * Если переданный элемент не существует,
     * необходимо выкинуть ошибку.
     * Сохраняет переданный элемент и регистрирует события
     * через registerEvents()
     * */
    constructor(element) {
        if (!element) {
            throw new Error('Element must be provided!');
        }
        this.#element = element;
        this.registerEvents();
    }

    /**
     * Вызывает метод render для отрисовки страницы
     * */
    update() {
        this.render(this.#lastOptions);
    }

    /**
     * Отслеживает нажатие на кнопку удаления транзакции
     * и удаления самого счёта. Внутри обработчика пользуйтесь
     * методами TransactionsPage.removeTransaction и
     * TransactionsPage.removeAccount соответственно
     * */
    registerEvents() {
        this.#element.addEventListener('click', (e) => {
            const transaction = e.target.closest('.transaction__remove');
            if (e.target.closest('.remove-account')) {
                this.removeAccount();
            } else if (transaction) {
                this.removeTransaction(transaction.dataset?.id);
            }
        });

    }

    /**
     * Удаляет счёт. Необходимо показать диаголовое окно (с помощью confirm())
     * Если пользователь согласен удалить счёт, вызовите
     * Account.remove, а также TransactionsPage.clear с
     * пустыми данными для того, чтобы очистить страницу.
     * По успешному удалению необходимо вызвать метод App.updateWidgets() и App.updateForms(),
     * либо обновляйте только виджет со счетами и формы создания дохода и расхода
     * для обновления приложения
     * */
    removeAccount() {
        if (!this.#lastOptions) {
            return;
        }
        const condition = confirm('Вы действительно хотите удалить счёт?');
        if (condition) {
            Account.remove({id: this.#lastOptions.account_id}, (err, res) => {
                if (res.success) {
                    App.updateForms();
                    App.updateWidgets();
                    this.clear();
                }
            });
        }
    }

    /**
     * Удаляет транзакцию (доход или расход). Требует
     * подтверждеия действия (с помощью confirm()).
     * По удалению транзакции вызовите метод App.update(),
     * либо обновляйте текущую страницу (метод update) и виджет со счетами
     * */
    removeTransaction(id) {
        const condition = confirm('Вы действительно хотите удалить эту транзакцию?');
        if (condition) {
            Transaction.remove({id}, (err, res) => {
                if (res.success) {
                    this.update();
                }
            });
        }
    }

    /**
     * С помощью Account.get() получает название счёта и отображает
     * его через TransactionsPage.renderTitle.
     * Получает список Transaction.list и полученные данные передаёт
     * в TransactionsPage.renderTransactions()
     * */
    render(options) {
        this.#lastOptions = options;
        if (!options) {
            return;
        }
        Account.get(options.account_id, (err, res) => {
            if (res?.success && res?.data) {
                this.renderTitle(res.data.name);
            }
        });
        Transaction.list(options, (err, res) => {
            if (res?.success && res?.data) {
                this.renderTransactions(res?.data);
            }
        });
    }

    /**
     * Очищает страницу. Вызывает
     * TransactionsPage.renderTransactions() с пустым массивом.
     * Устанавливает заголовок: «Название счёта»
     * */
    clear() {
        this.renderTransactions();
        this.renderTitle('Название счёта');
        this.#lastOptions = null;
    }

    /**
     * Устанавливает заголовок в элемент .content-title
     * */
    renderTitle(name) {
        this.#element.querySelector('.content-title').textContent = name;
    }

    /**
     * Форматирует дату в формате 2019-03-10 03:20:41 (строка)
     * в формат «10 марта 2019 г. в 03:20»
     * */
    formatDate(date) {
        date = new Date(date);
        const monthNames = [
            'января', 'февраля', 'марта',
            'апреля', 'мая', 'июня', 'июля',
            'августа', 'сентября', 'октября',
            'ноября', 'декабря'
        ];

        const day = date.getDate();
        const monthIndex = date.getMonth();
        const year = date.getFullYear();
        const hours = date.getHours();
        const minutes = date.getMinutes();

        const zeroed = num => {
            if (num < 10) {
                return `0${num}`;
            }
            return num;
        };


        return `${day} ${monthNames[monthIndex]} ${year} г. в ${zeroed(hours)}:${zeroed(minutes)}`;
    }

    /**
     * Формирует HTML-код транзакции (дохода или расхода).
     * item - объект с информацией о транзакции
     * */
    getTransactionHTML(item) {
        const additionalClass = item.type === 'income' ? 'transaction_income' : 'transaction_expense'
        return `
            <div class="transaction row ${additionalClass}">
                <div class="col-md-7 transaction__details">
                    <div class="transaction__icon">
                        <span class="fa fa-money fa-2x"></span>
                    </div>
                    <div class="transaction__info">
                       <h4 class="transaction__title">${item.name}</h4>
                       <div class="transaction__date">${this.formatDate(item.created_at)}</div>
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="transaction__summ">
                        ${item.sum} <span class="currency">₽</span>
                    </div>
                </div>
                <div class="col-md-2 transaction__controls">
                    <button class="btn btn-danger transaction__remove" data-id="${item.id}">
                        <i class="fa fa-trash"></i>  
                    </button>
                </div>
            </div>
        `;
    }

    /**
     * Отрисовывает список транзакций на странице
     * используя getTransactionHTML
     * */
    renderTransactions(data) {
        const str = data?.map(item => this.getTransactionHTML(item));
        if (str) {
            this.#element.querySelector('.content').innerHTML = str;
        }
    }
}

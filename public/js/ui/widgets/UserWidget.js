/**
 * Класс UserWidget отвечает за
 * отображение информации о имени пользователя
 * после авторизации или его выхода из системы
 * */

class UserWidget {

    #element;
    #userNameElement;

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
        this.#userNameElement = document.querySelector('.user-name');
    }

    /**
     * Получает информацию о текущем пользователе
     * с помощью User.current()
     * Если пользователь авторизован,
     * в элемент .user-name устанавливает имя
     * авторизованного пользователя
     * */
    update() {
        this.#userNameElement.textContent = User.current()?.name;
    }
}

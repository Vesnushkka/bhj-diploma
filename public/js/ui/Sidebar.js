/**
 * Класс Sidebar отвечает за работу боковой колонки:
 * кнопки скрытия/показа колонки в мобильной версии сайта
 * и за кнопки меню
 * */
class Sidebar {
    /**
     * Запускает initAuthLinks и initToggleButton
     * */
    static init() {
        this.initAuthLinks();
        this.initToggleButton();
    }

    /**
     * Отвечает за скрытие/показа боковой колонки:
     * переключает два класса для body: sidebar-open и sidebar-collapse
     * при нажатии на кнопку .sidebar-toggle
     * */
    static initToggleButton() {
        let isOpen = false; // closure
        const toggleButton = document.querySelector('a.sidebar-toggle');
        if (!toggleButton) {
            return;
        }
        toggleButton.addEventListener('click', (event) => {
            event.preventDefault();
            const isMobile = window.matchMedia('(max-width: 768px)');
            if (isMobile) {
                isOpen = !isOpen;
                if (isOpen) {
                    window.document.body.classList.add('sidebar-open', 'sidebar-collapse');
                } else {
                     window.document.body.classList.remove('sidebar-open', 'sidebar-collapse');
                }
            }
        });
    }

    /**
     * При нажатии на кнопку входа, показывает окно входа
     * (через найденное в App.getModal)
     * При нажатии на кнопку регастрации показывает окно регистрации
     * При нажатии на кнопку выхода вызывает User.logout и по успешному
     * выходу устанавливает App.setState( 'init' )
     * */
    static initAuthLinks() {
        App.getModal('register').bind(document.querySelector('.menu-item.menu-item_register'));
        App.getModal('login').bind(document.querySelector('.menu-item.menu-item_login'));
        document.querySelector('.menu-item.menu-item_logout')?.addEventListener('click', e => {
            e.preventDefault();
            User.logout(() => App.setState('init'));
        });
    }
}

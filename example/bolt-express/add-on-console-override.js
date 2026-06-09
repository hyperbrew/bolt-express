
    const prefixString = "[Add-on: " + "Bolt Express" + "]";
    const originalConsole = window.console;
    window.console = {
        ...originalConsole,
        log: (...args) => originalConsole.log(prefixString, ...args),
        info: (...args) => originalConsole.info(prefixString, ...args),
        warn: (...args) => originalConsole.warn(prefixString, ...args),
        error: (...args) => originalConsole.error(prefixString, ...args),
        debug: (...args) => originalConsole.debug(prefixString, ...args),
    };
    window.addEventListener("error", event => {
        event.preventDefault();
        console.error("Uncaught Exception:", event.error);
    });
    window.addEventListener("unhandledrejection", event => {
        event.preventDefault();
        console.error("Unhandled Promise Rejection:", event.reason);
    });

/**
 * Interceptor module which is used for special handling of user input.
 */

function muteStdout ( cli, dummy = '' ) {
    const originalHandler = cli._writeToOutput;
    let once = false;

    cli._writeToOutput = () => {
        if ( !once ) {
            once = true;
            cli.output.write(dummy);
        }
    };

    return originalHandler;
}

function unmuteStdout ( cli, handler ) {
    cli._writeToOutput = handler;
}


export {
    muteStdout,
    unmuteStdout
};

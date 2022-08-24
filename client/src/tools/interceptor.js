/**
 *
 */

function muteStdout ( cli, dummy = '' ) {
    const originalHandler = cli._writeToOutput;

    cli._writeToOutput = () => cli.line.length || cli.output.write(dummy);

    return originalHandler;
}

function unmuteStdout ( cli, handler ) {
    cli._writeToOutput = handler;
}

module.exports = {
    muteStdout,
    unmuteStdout
};

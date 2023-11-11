import { table, TableUserConfig } from 'table';
import chalk, { BackgroundColorName, ForegroundColorName } from 'chalk';

type CustomUserConfig = {
    headerColor?: ForegroundColorName;
    headerBgColor?: BackgroundColorName;
};

export const useTable = (
    head: string[],
    body: unknown[][],
    config?: TableUserConfig,
    customConfig?: CustomUserConfig
): string => {
    if (!body.length) {
        return chalk.blue('No entries found.');
    }
    // TODO: find better way to transform header
    if (customConfig?.headerColor || customConfig?.headerBgColor) {
        head = head.map((item) =>
            customConfig?.headerColor && customConfig?.headerBgColor
                ? chalk[customConfig.headerColor][customConfig.headerBgColor](item)
                : customConfig?.headerColor
                ? chalk[customConfig.headerColor](item)
                : customConfig.headerBgColor
                ? chalk[customConfig.headerBgColor](item)
                : item
        );
    }

    return table([head, ...body], config);
};

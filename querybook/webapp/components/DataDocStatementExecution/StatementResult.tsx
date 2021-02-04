import classNames from 'classnames';
import React from 'react';

import { formatNumber } from 'lib/utils/number';
import {
    IStatementExecution,
    IStatementResult,
} from 'redux/queryExecutions/types';

import { Loading } from 'ui/Loading/Loading';
import { Message } from 'ui/Message/Message';
import { Button } from 'ui/Button/Button';
import { PrettyNumber } from 'ui/PrettyNumber/PrettyNumber';
import { StatementResultTable } from './StatementResultTable';

interface IProps {
    statementResult: IStatementResult;
    statementExecution: IStatementExecution;
    isFullscreen: boolean;
    onFullscreenToggle: () => any;
}

export const StatementResult: React.FC<IProps> = ({
    statementExecution,
    statementResult,
    isFullscreen,
    onFullscreenToggle,
}) => {
    const getFetchInfoDOM = (
        resultRowMinusColCount: number,
        actualRowMinusColCount: number,
        fetchedAllRows: boolean
    ) => {
        const resultPreviewTooltip = `Download full result (${formatNumber(
            resultRowMinusColCount,
            'row'
        )}) through Export.`;

        const fetchRowInfo = fetchedAllRows ? (
            `Full Result (${formatNumber(actualRowMinusColCount, 'row')})`
        ) : (
            <span>
                <span className="warning-word">
                    Previewing First{' '}
                    <PrettyNumber val={actualRowMinusColCount} unit="Row" />{' '}
                </span>
                <span>
                    Full Result (
                    <PrettyNumber
                        val={resultRowMinusColCount}
                        unit="Row"
                    />){' '}
                </span>
                <span aria-label={resultPreviewTooltip} data-balloon-pos={'up'}>
                    <i className="fas fa-info-circle" />
                </span>
            </span>
        );

        return (
            <span
                className={classNames({
                    'number-of-rows-message': true,
                    'more-rows-than-shown': !fetchedAllRows,
                })}
            >
                {fetchRowInfo}
            </span>
        );
    };

    const { result_row_count: resultRowCount } = statementExecution;

    let fetchRowInfoDOM = null;
    let visualizationDOM = null;

    const exploreButtonDOM = (
        <Button
            onClick={onFullscreenToggle}
            icon={isFullscreen ? 'minimize-2' : 'maximize-2'}
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
            borderless
            small
            type="inlineText"
        />
    );

    if (resultRowCount === 0) {
        visualizationDOM = (
            <div className="statement-execution-no-output">No Output</div>
        );
    } else if (!statementResult) {
        visualizationDOM = <Loading />;
    } else {
        const { data, failed, error } = statementResult;

        if (failed) {
            return (
                <Message
                    title="Cannot Load Statement Result"
                    message={error}
                    type="error"
                />
            );
        }

        const resultRowMinusColCount = Math.max(resultRowCount - 1, 0);
        const actualRowsMinusColCount = Math.max(data.length - 1, 0);
        const fetchedAllRows =
            resultRowMinusColCount === actualRowsMinusColCount;

        fetchRowInfoDOM = getFetchInfoDOM(
            resultRowMinusColCount,
            actualRowsMinusColCount,
            fetchedAllRows
        );
        visualizationDOM = data.length ? (
            <StatementResultTable
                data={data}
                paginate={!isFullscreen}
                isPreview={!fetchedAllRows}
            />
        ) : null;
    }

    return (
        <div
            className={classNames({
                StatementResult: true,
                fullscreen: isFullscreen,
            })}
        >
            <div className="statement-results-summary horizontal-space-between">
                {fetchRowInfoDOM}
                {exploreButtonDOM}
            </div>
            {visualizationDOM}
        </div>
    );
};
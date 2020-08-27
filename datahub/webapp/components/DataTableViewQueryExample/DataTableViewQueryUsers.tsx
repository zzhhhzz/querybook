import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { IStoreState, Dispatch } from 'redux/store/types';
import { fetchTopQueryUsersIfNeeded } from 'redux/dataSources/action';

import { UserAvatarList } from 'components/UserBadge/UserAvatarList';
import { Loading } from 'ui/Loading/Loading';

export const DataTableViewQueryUsers: React.FC<{
    tableId: number;
    onClick?: (uid: number) => any;
}> = ({ tableId, onClick = null }) => {
    const [loading, setLoading] = useState(false);
    const topQueryUsers = useSelector(
        (state: IStoreState) =>
            state.dataSources.queryTopUsersByTableId[tableId]
    );
    const userInfoById = useSelector(
        (state: IStoreState) => state.user.userInfoById
    );
    const dispatch: Dispatch = useDispatch();

    useEffect(() => {
        setLoading(true);
        dispatch(fetchTopQueryUsersIfNeeded(tableId)).finally(() => {
            setLoading(false);
        });
    }, [tableId]);

    const viewersDOM = loading ? (
        <Loading />
    ) : !topQueryUsers?.length ? (
        <div>No user has queried this table on DataHub.</div>
    ) : (
        <UserAvatarList
            users={topQueryUsers.map((topQueryUser) => ({
                uid: topQueryUser.uid,
                onClick: onClick ? () => onClick(topQueryUser.uid) : null,
                tooltip: `${
                    userInfoById[topQueryUser.uid]?.username ?? 'Loading'
                }, query count ${topQueryUser.count}`,
            }))}
        />
    );

    return (
        <div className="DataTableViewQueryUsers">
            <div>Click on a user to see their queries</div>
            <div className="DataTableViewQueryUsers-users center-align">
                {viewersDOM}
            </div>
        </div>
    );
};
import { useRouter } from 'next/router';
import React from 'react';

import type { RoutedTab } from 'ui/shared/Tabs/types';

import useApiQuery from 'lib/api/useApiQuery';
import { useAppContext } from 'lib/contexts/app';
import useIsMobile from 'lib/hooks/useIsMobile';
import getQueryParamString from 'lib/router/getQueryParamString';
import { USER_OP } from 'stubs/userOps';
import TextAd from 'ui/shared/ad/TextAd';
import HashStringShortenDynamic from 'ui/shared/HashStringShortenDynamic';
import PageTitle from 'ui/shared/Page/PageTitle';
import RoutedTabs from 'ui/shared/Tabs/RoutedTabs';
import TabsSkeleton from 'ui/shared/Tabs/TabsSkeleton';
import UserOpDetails from 'ui/userOp/UserOpDetails';

const TAB_LIST_PROPS = {
  marginBottom: 0,
  py: 5,
  marginTop: -5,
};

const BlockPageContent = () => {
  const router = useRouter();
  const isMobile = useIsMobile();
  const appProps = useAppContext();
  const hash = getQueryParamString(router.query.hash);

  const userOpQuery = useApiQuery('user_op', {
    pathParams: { hash: hash },
    queryOptions: {
      enabled: Boolean(hash),
      placeholderData: USER_OP,
    },
  });

  const tabs: Array<RoutedTab> = React.useMemo(() => ([
    { id: 'index', title: 'Details', component: <UserOpDetails query={ userOpQuery }/> },
    { id: 'token_transfers', title: 'Token transfers', component: null },
    // { id: 'token_transfers', title: 'Token transfers', component: <UserOpTokenTransfers txHash={ userOpQuery.data?.transaction_hash }/> },
    // { id: 'call_data', title: 'Call data', component: <UserOpCallData callData={ userOpQuery.data?.call_data }/> }
    // { id: 'logs', title: 'Logs', component: <UserOpLogs txHash={ userOpQuery.data?.transaction_hash }/> }
    // { id: 'raw', title: 'Raw', component: <UserOpRaw txHash={ userOpQuery.data?.transaction_hash }/> }
  ].filter(Boolean)), [ userOpQuery ]);

  if (!hash) {
    throw new Error('User operation not found', { cause: { status: 404 } });
  }

  if (userOpQuery.isError) {
    throw new Error(undefined, { cause: userOpQuery.error });
  }

  const backLink = React.useMemo(() => {
    const hasGoBackLink = appProps.referrer && appProps.referrer.includes('/ops');

    if (!hasGoBackLink) {
      return;
    }

    return {
      label: 'Back to user operations list',
      url: appProps.referrer,
    };
  }, [ appProps.referrer ]);

  const titleSecondRow = <HashStringShortenDynamic hash={ hash }/>;

  return (
    <>
      <TextAd mb={ 6 }/>
      <PageTitle
        title="User operation details"
        backLink={ backLink }
        secondRow={ titleSecondRow }
      />
      { userOpQuery.isPlaceholderData ? <TabsSkeleton tabs={ tabs }/> : <RoutedTabs tabs={ tabs } tabListProps={ isMobile ? undefined : TAB_LIST_PROPS }/> }
    </>
  );
};

export default BlockPageContent;

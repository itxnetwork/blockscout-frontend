import { chakra, Skeleton } from '@chakra-ui/react';
import React from 'react';

import type { EnsDomain } from 'types/api/ens';

import dayjs from 'lib/date/dayjs';
import NameDomainExpiryStatus from 'ui/nameDomain/NameDomainExpiryStatus';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';
import EnsEntity from 'ui/shared/entities/ens/EnsEntity';
import ListItemMobileGrid from 'ui/shared/ListItemMobile/ListItemMobileGrid';

interface Props extends EnsDomain {
  isLoading: boolean;
}

const NameDomainsListItem = ({ name, isLoading, resolvedAddress, registrationDate, expiryDate }: Props) => {
  return (
    <ListItemMobileGrid.Container>
      <ListItemMobileGrid.Label isLoading={ isLoading }>Domain</ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value>
        <EnsEntity name={ name } isLoading={ isLoading } fontWeight={ 500 }/>
      </ListItemMobileGrid.Value>

      { resolvedAddress && (
        <>
          <ListItemMobileGrid.Label isLoading={ isLoading }>Address</ListItemMobileGrid.Label>
          <ListItemMobileGrid.Value>
            <AddressEntity address={ resolvedAddress } isLoading={ isLoading } fontWeight={ 500 }/>
          </ListItemMobileGrid.Value>
        </>
      ) }

      { registrationDate && (
        <>
          <ListItemMobileGrid.Label isLoading={ isLoading }>Registered on</ListItemMobileGrid.Label>
          <ListItemMobileGrid.Value>
            <Skeleton isLoaded={ !isLoading }>
              { dayjs(registrationDate).format('MMM DD YYYY HH:mm:ss A') }
              <chakra.span color="text_secondary"> { dayjs(registrationDate).fromNow() }</chakra.span>
            </Skeleton>
          </ListItemMobileGrid.Value>
        </>
      ) }

      { expiryDate && (
        <>
          <ListItemMobileGrid.Label isLoading={ isLoading }>Registered on</ListItemMobileGrid.Label>
          <ListItemMobileGrid.Value>
            <Skeleton isLoaded={ !isLoading } whiteSpace="pre-wrap">
              <span>{ dayjs(expiryDate).format('MMM DD YYYY HH:mm:ss A') } </span>
              <NameDomainExpiryStatus date={ expiryDate }/>
            </Skeleton>
          </ListItemMobileGrid.Value>
        </>
      ) }
    </ListItemMobileGrid.Container>
  );
};

export default React.memo(NameDomainsListItem);

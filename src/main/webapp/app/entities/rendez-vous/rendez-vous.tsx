import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button, Table } from 'reactstrap';
import { Translate, TextFormat, getSortState } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSort, faSortUp, faSortDown } from '@fortawesome/free-solid-svg-icons';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';
import { ASC, DESC, SORT } from 'app/shared/util/pagination.constants';
import { overrideSortStateWithQueryParams } from 'app/shared/util/entity-utils';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntities } from './rendez-vous.reducer';

export const RendezVous = () => {
  const dispatch = useAppDispatch();

  const pageLocation = useLocation();
  const navigate = useNavigate();

  const [sortState, setSortState] = useState(overrideSortStateWithQueryParams(getSortState(pageLocation, 'id'), pageLocation.search));

  const rendezVousList = useAppSelector(state => state.rendezVous.entities);
  const loading = useAppSelector(state => state.rendezVous.loading);

  const getAllEntities = () => {
    dispatch(
      getEntities({
        sort: `${sortState.sort},${sortState.order}`,
      }),
    );
  };

  const sortEntities = () => {
    getAllEntities();
    const endURL = `?sort=${sortState.sort},${sortState.order}`;
    if (pageLocation.search !== endURL) {
      navigate(`${pageLocation.pathname}${endURL}`);
    }
  };

  useEffect(() => {
    sortEntities();
  }, [sortState.order, sortState.sort]);

  const sort = p => () => {
    setSortState({
      ...sortState,
      order: sortState.order === ASC ? DESC : ASC,
      sort: p,
    });
  };

  const handleSyncList = () => {
    sortEntities();
  };

  const getSortIconByFieldName = (fieldName: string) => {
    const sortFieldName = sortState.sort;
    const order = sortState.order;
    if (sortFieldName !== fieldName) {
      return faSort;
    } else {
      return order === ASC ? faSortUp : faSortDown;
    }
  };

  return (
    <div>
      <h2 id="rendez-vous-heading" data-cy="RendezVousHeading">
        <Translate contentKey="assistanteDermatologueApp.rendezVous.home.title">Rendez Vous</Translate>
        <div className="d-flex justify-content-end">
          <Button className="me-2" color="info" onClick={handleSyncList} disabled={loading}>
            <FontAwesomeIcon icon="sync" spin={loading} />{' '}
            <Translate contentKey="assistanteDermatologueApp.rendezVous.home.refreshListLabel">Refresh List</Translate>
          </Button>
          <Link to="/rendez-vous/new" className="btn btn-primary jh-create-entity" id="jh-create-entity" data-cy="entityCreateButton">
            <FontAwesomeIcon icon="plus" />
            &nbsp;
            <Translate contentKey="assistanteDermatologueApp.rendezVous.home.createLabel">Create new Rendez Vous</Translate>
          </Link>
        </div>
      </h2>
      <div className="table-responsive">
        {rendezVousList && rendezVousList.length > 0 ? (
          <Table responsive>
            <thead>
              <tr>
                <th className="hand" onClick={sort('id')}>
                  <Translate contentKey="assistanteDermatologueApp.rendezVous.id">ID</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('id')} />
                </th>
                <th className="hand" onClick={sort('dateDebut')}>
                  <Translate contentKey="assistanteDermatologueApp.rendezVous.dateDebut">Date Debut</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('dateDebut')} />
                </th>
                <th className="hand" onClick={sort('dateFin')}>
                  <Translate contentKey="assistanteDermatologueApp.rendezVous.dateFin">Date Fin</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('dateFin')} />
                </th>
                <th className="hand" onClick={sort('statut')}>
                  <Translate contentKey="assistanteDermatologueApp.rendezVous.statut">Statut</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('statut')} />
                </th>
                <th>
                  <Translate contentKey="assistanteDermatologueApp.rendezVous.dermatologues">Dermatologues</Translate>{' '}
                  <FontAwesomeIcon icon="sort" />
                </th>
                <th>
                  <Translate contentKey="assistanteDermatologueApp.rendezVous.patients">Patients</Translate> <FontAwesomeIcon icon="sort" />
                </th>
                <th />
              </tr>
            </thead>
            <tbody>
              {rendezVousList.map((rendezVous, i) => (
                <tr key={`entity-${i}`} data-cy="entityTable">
                  <td>
                    <Button tag={Link} to={`/rendez-vous/${rendezVous.id}`} color="link" size="sm">
                      {rendezVous.id}
                    </Button>
                  </td>
                  <td>{rendezVous.dateDebut ? <TextFormat type="date" value={rendezVous.dateDebut} format={APP_DATE_FORMAT} /> : null}</td>
                  <td>{rendezVous.dateFin ? <TextFormat type="date" value={rendezVous.dateFin} format={APP_DATE_FORMAT} /> : null}</td>
                  <td>{rendezVous.statut ? 'true' : 'false'}</td>
                  <td>
                    {rendezVous.dermatologues ? (
                      <Link to={`/dermatologue/${rendezVous.dermatologues.id}`}>{rendezVous.dermatologues.id}</Link>
                    ) : (
                      ''
                    )}
                  </td>
                  <td>{rendezVous.patients ? <Link to={`/patient/${rendezVous.patients.id}`}>{rendezVous.patients.id}</Link> : ''}</td>
                  <td className="text-end">
                    <div className="btn-group flex-btn-group-container">
                      <Button tag={Link} to={`/rendez-vous/${rendezVous.id}`} color="info" size="sm" data-cy="entityDetailsButton">
                        <FontAwesomeIcon icon="eye" />{' '}
                        <span className="d-none d-md-inline">
                          <Translate contentKey="entity.action.view">View</Translate>
                        </span>
                      </Button>
                      <Button tag={Link} to={`/rendez-vous/${rendezVous.id}/edit`} color="primary" size="sm" data-cy="entityEditButton">
                        <FontAwesomeIcon icon="pencil-alt" />{' '}
                        <span className="d-none d-md-inline">
                          <Translate contentKey="entity.action.edit">Edit</Translate>
                        </span>
                      </Button>
                      <Button tag={Link} to={`/rendez-vous/${rendezVous.id}/delete`} color="danger" size="sm" data-cy="entityDeleteButton">
                        <FontAwesomeIcon icon="trash" />{' '}
                        <span className="d-none d-md-inline">
                          <Translate contentKey="entity.action.delete">Delete</Translate>
                        </span>
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          !loading && (
            <div className="alert alert-warning">
              <Translate contentKey="assistanteDermatologueApp.rendezVous.home.notFound">No Rendez Vous found</Translate>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default RendezVous;

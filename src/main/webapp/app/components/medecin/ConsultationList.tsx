import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate, useNavigation } from 'react-router-dom';
import { Button, Table } from 'reactstrap';
import { Translate, TextFormat, getSortState } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSort, faSortUp, faSortDown } from '@fortawesome/free-solid-svg-icons';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';
import { ASC, DESC, SORT } from 'app/shared/util/pagination.constants';
import { overrideSortStateWithQueryParams } from 'app/shared/util/entity-utils';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import $ from 'jquery';
import 'jquery';
import 'datatables.net-dt/js/dataTables.dataTables';
import 'datatables.net-responsive-dt/js/responsive.dataTables';
import 'datatables.net-dt/css/jquery.dataTables.css';
import 'datatables.net-responsive-dt/css/responsive.dataTables.css';
import { redirect } from 'react-router';
import axios from 'axios';
import { faFileMedical } from '@fortawesome/free-solid-svg-icons';
export const ConsultationList = () => {
  const [consultationList, setConsultationList] = useState([]);
  const [conAll, setConAll] = useState([]);
  const userData = JSON.parse(sessionStorage.getItem('user_data'));
  const [choix, setChoix] = useState('All');
  const tableRef = useRef(null);
  const [isToday, setToday] = useState(true);

  const consultationForToday = id => {
    axios
      .get('/api/consultations/listeConsultations/dematologue/' + userData.id)
      .then(response => {
        console.log(response.data);
        setConsultationList(response.data);
      })
      .catch(error => {
        console.log(error);
      });
  };

  const allConsultation = () => {
    axios
      .get('/api/consultations')
      .then(response => {
        console.log(response.data);
        setConsultationList(response.data);
      })
      .catch(error => {
        console.log(error);
      });
  };

  // useEffect(() => {
  //   if (consultationList.length > 0) {
  //     const table = $('#myTable').DataTable();
  //     // table.order([0, 'desc']).draw();
  //     tableRef.current = table;
  //
  //     return () => {
  //       if (tableRef.current) {
  //         tableRef.current.destroy();
  //       }
  //     };
  //   }
  // }, [consultationList]);

  // useEffect(() => {
  //   if (consultationList.length > 0) {
  //     const table = $('#myTable').DataTable();
  //     table.order([0, 'desc']).draw();
  //     return () => {
  //       table.destroy();
  //     };
  //   }
  // }, []);

  useEffect(() => {
    consultationForToday(userData.id);
    // const table = $('#myTable').DataTable();
    // table.order([0, 'desc']).draw();
  }, []);

  const extractDate = dateTimeString => {
    const date = new Date(dateTimeString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const extractTime = dateTimeString => {
    const date = new Date(dateTimeString);
    const hours = String(date.getUTCHours()).padStart(2, '0');
    const minutes = String(date.getUTCMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const changeChoix = () => {
    if (choix === 'All') {
      setToday(true);
      setChoix('Today');
      allConsultation();
      const table1 = $('#myTable').DataTable();
      table1.destroy();
      const table = $('#myTable').DataTable();
    } else {
      setToday(false);
      setChoix('All');
      consultationForToday(userData.id);
      const table1 = $('#myTable').DataTable();
      table1.destroy();
      const table = $('#myTable').DataTable();
    }
  };

  const navigate = useNavigate();
  const toNavigate = (id, patient) => {
    sessionStorage.setItem('consultation_id', id);
    sessionStorage.setItem('patientName', patient);
    navigate('/diagnostic');
  };

  return (
    <>
      <div className="p-2 card p-4">
        <h2 id="consultation-heading" data-cy="ConsultationHeading" className="card-header">
          My consultations
          <div className="d-flex justify-content-end">
            <button className="btn btn-secondary  btn-lg" onClick={() => changeChoix()}>
              {choix}
            </button>
          </div>
        </h2>
        <div className="card-body table-reponsive">
          {consultationList && consultationList.length > 0 ? (
            <table className="table-responsive">
              <thead>
                <tr>
                  <th className="hand">Date consultation</th>
                  <th>Hour</th>
                  <th>Patient</th>
                  <th>Patient phone</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {consultationList.map((consultation, index) => (
                  <tr key={index}>
                    <td>{extractDate(consultation.dateConsultation)}</td>
                    <td>{extractTime(consultation.dateConsultation)}</td>
                    <td>{consultation.rendezVous.patient.user.firstName + ' ' + consultation.rendezVous.patient.user.lastName}</td>
                    <td>{consultation.rendezVous.patient.telephone}</td>
                    <td>
                      <button
                        className="btn btn-primary m-1"
                        title="Diagnostic"
                        onClick={() =>
                          toNavigate(
                            consultation.id,
                            consultation.rendezVous.patient.user.firstName + ' ' + consultation.rendezVous.patient.user.lastName,
                          )
                        }
                      >
                        <FontAwesomeIcon icon={faFileMedical} /> <span className="d-none d-md-inline">Diagnostic</span>
                      </button>
                      <button className="btn btn-danger">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <>No data</>
          )}
        </div>
      </div>
    </>
  );
};

export default ConsultationList;
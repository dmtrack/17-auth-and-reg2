import React, { useEffect } from "react";
import PropTypes from "prop-types";
import Quality from "./quality";
import { useDispatch, useSelector } from "react-redux";
import {
  getQualitiesByIds,
  getQualitiesLoadingStatus,
  loadQualitiesList,
} from "../../../store/qualities";

const QualitiesList = ({ qualities }) => {
  const dispatch = useDispatch();
  const isLoading = useSelector(getQualitiesLoadingStatus());

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const qualitiesList = useSelector(getQualitiesByIds(qualities));
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    dispatch(loadQualitiesList());
  }, []);
  if (isLoading) return "Loading...";
  return (
    <>
      {qualitiesList.map((qual) => (
        <Quality key={qual._id} {...qual} />
      ))}
    </>
  );
};

QualitiesList.propTypes = {
  qualities: PropTypes.array,
};

export default QualitiesList;

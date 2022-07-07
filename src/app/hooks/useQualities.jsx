import React, { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import PropTypes from "prop-types";
import qualityService from "../services/quality.service";

const QualitiesContext = React.createContext();

export const useQualities = () => {
  return useContext(QualitiesContext);
};

export const QualitiesProvider = ({ children }) => {
  const [qualities, setQualities] = useState([]);
  const [error, setError] = useState(null);
  const [qualitiesIsLoading, setQualitiesLoading] = useState(true);

  useEffect(() => {
    const getQualities = async () => {
      try {
        const { content } = await qualityService.fetchAll();
        setQualities(content);
        setQualitiesLoading(false);
      } catch (error) {
        errorCatcher(error);
      }
    };
    getQualities();
  }, []);
  const getQuality = (id) => {
    return qualities.find((q) => q._id === id);
  };

  function errorCatcher(error) {
    const { message } = error.response.data;
    setError(message);
  }

  useEffect(() => {
    if (error !== null) {
      toast(error);
      setError(null);
    }
  }, [error]);

  return (
    <QualitiesContext.Provider
      value={{
        qualities,
        getQuality,
        qualitiesIsLoading,
        setQualitiesLoading,
      }}
    >
      {children}
    </QualitiesContext.Provider>
  );
};

QualitiesProvider.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
};

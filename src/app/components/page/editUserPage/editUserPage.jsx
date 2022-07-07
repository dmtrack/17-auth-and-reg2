import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { validator } from "../../../utils/validator";
import TextField from "../../common/form/textField";
import SelectField from "../../common/form/selectField";
import RadioField from "../../common/form/radioField";
import MultiSelectField from "../../common/form/multiSelectField";
import BackHistoryButton from "../../common/backButton";
import { useAuth } from "../../../hooks/useAuth";
import { useProfessions } from "../../../hooks/useProfession";
import { useQualities } from "../../../hooks/useQualities";

const EditUserPage = () => {
  const { currentUser, editUserData } = useAuth();
  const history = useHistory();
  const [isLoading, setIsLoading] = useState(false);
  const { professions, professionsIsLoading, setProfessionsLoading } =
    useProfessions();
  const { qualities, qualitiesIsLoading, setQualitiesLoading } = useQualities();
  const [errors, setErrors] = useState({});

  const professionsList = professions.map((p) => ({
    label: p.name,
    value: p._id,
  }));

  const [data, setData] = useState({
    name: "",
    email: "",
    profession: "",
    sex: "male",
    qualities: [],
  });

  const getQualities = (elements) => {
    const qualitiesArray = [];
    for (const elem of elements) {
      for (const quality in qualities) {
        if (elem === qualities[quality]._id) {
          qualitiesArray.push({
            value: qualities[quality]._id,
            label: qualities[quality].name,
            color: qualities[quality].color,
          });
        }
      }
    }
    return qualitiesArray;
  };

  function getProfessionById(id) {
    for (const prof of professions) {
      if (prof._id === id) {
        return prof.name;
      }
    }
  }

  const transformData = (data) => {
    return data.map((qual) => ({
      label: qual.name,
      value: qual._id,
      color: qual.color,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isValid = validate();
    if (!isValid) return;
    const newData = {
      ...data,
      qualities: data.qualities.map((q) => q.value),
      profession: data.profession,
    };
    try {
      await editUserData(newData);
      history.push(`/users/${currentUser._id}`);
    } catch (error) {
      setErrors(error);
    }
  };
  useEffect(() => {
    setProfessionsLoading(true);
    setQualitiesLoading(true);
    setData((prevState) => ({
      ...prevState,
      ...data,
      qualities: getQualities(currentUser.qualities),
      profession: currentUser.profession,
      name: currentUser.name,
      email: currentUser.email,
      id: currentUser._id,
      sex: currentUser.sex,
    }));
    setProfessionsLoading(false);
    setQualitiesLoading(false);
    setIsLoading(false);
  }, []);

  const validatorConfig = {
    email: {
      isRequired: {
        message: "Электронная почта обязательна для заполнения",
      },
      isEmail: {
        message: "Email введен некорректно",
      },
    },
    name: {
      isRequired: {
        message: "Введите ваше имя",
      },
    },
  };
  useEffect(() => {
    validate();
  }, [data]);

  useEffect(() => {
    if (data && isLoading) {
      setIsLoading(false);
    }
  }, [data]);

  const handleChange = (target) => {
    console.log(target.value);
    setData((prevState) => ({
      ...prevState,
      [target.name]: target.value,
    }));
    console.log(data);
  };

  const validate = () => {
    const errors = validator(data, validatorConfig);
    setErrors(errors);
    return Object.keys(errors).length === 0;
  };
  const isValid = Object.keys(errors).length === 0;
  console.log(data);
  return (
    !professionsIsLoading &&
    !qualitiesIsLoading && (
      <div className="container mt-5">
        <BackHistoryButton />
        <div className="row">
          <div className="col-md-6 offset-md-3 shadow p-4">
            {!isLoading ? (
              <form onSubmit={handleSubmit}>
                <TextField
                  label="Имя"
                  name="name"
                  value={data.name}
                  onChange={handleChange}
                  error={errors.name}
                />
                <TextField
                  label="Электронная почта"
                  name="email"
                  value={data.email}
                  onChange={handleChange}
                  error={errors.email}
                />

                <SelectField
                  label="Выбери свою профессию"
                  defaultOption="Choose..."
                  name="profession"
                  onChange={handleChange}
                  value={getProfessionById(data.profession)}
                  options={professionsList}
                  error={errors.profession}
                />
                <RadioField
                  options={[
                    { name: "Male", value: "male" },
                    { name: "Female", value: "female" },
                    { name: "Other", value: "other" },
                  ]}
                  value={data.sex}
                  name="sex"
                  onChange={handleChange}
                  label="Выберите ваш пол"
                />
                <MultiSelectField
                  key={data.qualities}
                  defaultValue={data.qualities}
                  options={transformData(qualities)}
                  onChange={handleChange}
                  name="qualities"
                  label="Выберите ваши качества"
                />
                <button
                  type="submit"
                  disabled={!isValid}
                  className="btn btn-primary w-100 mx-auto"
                >
                  Обновить
                </button>
              </form>
            ) : (
              "Loading..."
            )}
          </div>
        </div>
      </div>
    )
  );
};
export default EditUserPage;

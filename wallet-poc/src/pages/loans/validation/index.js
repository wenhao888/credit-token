import validator from 'validator';

function isBlank(value="") {
  let trimmed = (value||"").trim();
  return  trimmed === "";
}


function isNotBlank(value="") {
  return ! isBlank(value)
}


function isIntegerOrBlank(value="") {
  return isBlank(value) || validator.isInt(value);
}

function isFloatOrBlank(value="") {
  return isBlank(value) || validator.isFloat(value);
}


export {isBlank, isIntegerOrBlank, isFloatOrBlank}

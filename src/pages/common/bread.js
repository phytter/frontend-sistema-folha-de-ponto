import PropTypes from 'prop-types';
import { baseApi as api } from '../../config/api';

class Bread {
  constructor(baseURL) {
    this.baseURL = baseURL;
  }

  /**
   * Display a listing of the resource.
   */
  async index(aqp) {
    return api
      .get(this.baseURL, { params: aqp })
      .then((response) => response.data);
  }

  /**
   * Store a newly created resource in storage.
   */
  async store(data, config) {
    return api
      .post(this.baseURL, data, config)
      .then((response) => response.data);
  }

  /**
   * Display the specified resource.
   */
  async show(id) {
    const baseURL = `${this.baseURL}/${id}`;
    return api.get(baseURL).then((response) => response.data);
  }

  /**
   * Update the specified resource in storage.
   */
  async update(id, data, config) {
    const baseURL = `${this.baseURL}/${id}`;
    return api.put(baseURL, data, config).then((response) => response.data);
  }

  /**
   * Remove the specified resource from storage.
   */
  async destroy(id) {
    const baseURL = `${this.baseURL}/${id}`;
    return api.delete(baseURL).then((response) => response.data);
  }
}

Bread.propTypes = {
  baseURL: PropTypes.string.isRequired,
};

export default Bread;

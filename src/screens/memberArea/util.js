const listOfActiveNotifications = {};



// actionHandler(this, this.props.updateUserBio, data, 'edit_profile');






export const actionHandler = (type, that, action, data) => {
  that.setState({ isLoading: true }, () => {

    action(data, (success, error) => {
      listOfActiveNotifications[type] = Date.now();
      if (success) {
        that.setState({ error: '', success: success, isLoading: false });
      } else {
        that.setState({ error: error, success: '', isLoading: false });
      }

      setTimeout(() => {
        if ((Date.now() - listOfActiveNotifications[type]) >= 3000) {
          that.setState({ error: '', success: '' });
          delete listOfActiveNotifications[type];
        }
      }, 3000);
    });

  });
}

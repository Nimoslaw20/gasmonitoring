const express = require('express');
const router = express.Router();
const authorityBranchController = require('../../controllers/authority-branch/authority-branch-controller');

router
  .route('/authority-branches')
  .get(authorityBranchController.read)
  .post(authorityBranchController.create);

router
  .route('/authority-branch/:id')
  .patch(authorityBranchController.update)
  .delete(authorityBranchController.delete);

// router.patch(
//   '/authority/updateBranchField/:id',
//   authorityBranchController.updateAFieldByInfo
// );

module.exports = router;

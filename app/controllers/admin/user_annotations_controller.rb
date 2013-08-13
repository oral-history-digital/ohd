class UserAnnotationsController < Admin::BaseController

  actions :index, :show

  def accept
    object.accept!
    flash['alert'] = 'Nutzeranmerkung veröffentlicht.'
    redirect_to admin_user_annotation_path(@object)
  end

  def reject
    object.reject!
    flash['alert'] = 'Nutzeranmerkung abgelehnt.'
    redirect_to admin_user_annotation_path(@object)
  end

  def remove
    object.remove!
    flash['alert'] = 'Nutzeranmerkung aus dem Archiv entfernt.'
    redirect_to admin_user_annotation_path(@object)
  end

  def withdraw
    object.withdraw!
    flash['alert'] = 'Nutzeranmerkung aus der Veröffentlichung zurückgezogen.'
    redirect_to admin_user_annotation_path(@object)
  end

  def postpone
    object.postpone!
    flash['alert'] = 'Veröffentlichung der Nutzeranmerkung zurückgestellt.'
    redirect_to admin_user_annotation_path(@object)
  end

  def review
    object.review!
    flash['alert'] = 'Rückstellung der Nutzeranmerkung aufgehoben.'
    redirect_to admin_user_annotation_path(@object)
  end

end
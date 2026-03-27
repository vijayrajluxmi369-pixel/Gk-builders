import { useState } from "react";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { FileText, CheckCircle2, Download, Globe } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function ServiceContractForm() {
  const { language, setLanguage, t } = useLanguage();
  const [formData, setFormData] = useState({
    clientName: "",
    clientPhone: "",
    clientEmail: "",
    siteAddress: "",
    projectType: "New Construction" as "New Construction" | "Renovation" | "Material Supply",
    projectDescription: "",
    estimatedBudget: "",
    projectStartDate: "",
    agreedToTerms: false,
    termsAgreed: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [isDownloadingPDF, setIsDownloadingPDF] = useState(false);
  const [showTerms, setShowTerms] = useState(false);

  const submitContractMutation = trpc.contracts.submit.useMutation();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleDownloadPDF = async () => {
    setIsDownloadingPDF(true);
    try {
      // Create a simple HTML template for the PDF
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <title>GK Builders Service Contract Form</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; line-height: 1.6; }
            .header { text-align: center; margin-bottom: 30px; border-bottom: 3px solid #DC2626; padding-bottom: 15px; }
            .logo { font-size: 24px; font-weight: bold; color: #DC2626; }
            .subtitle { color: #666; margin-top: 5px; }
            .section { margin-bottom: 25px; }
            .section-title { font-size: 16px; font-weight: bold; color: #1F2937; border-bottom: 2px solid #DC2626; padding-bottom: 8px; margin-bottom: 15px; }
            .form-row { display: flex; gap: 30px; margin-bottom: 15px; }
            .form-field { flex: 1; }
            .form-field label { font-weight: bold; color: #333; display: block; margin-bottom: 5px; }
            .form-field input, .form-field textarea, .form-field select { width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; font-family: Arial; }
            .form-field textarea { min-height: 80px; }
            .checkbox-section { margin: 15px 0; padding: 10px; background: #f5f5f5; border-left: 4px solid #DC2626; }
            .checkbox-section input { margin-right: 8px; }
            .footer { margin-top: 30px; padding-top: 15px; border-top: 1px solid #ddd; font-size: 12px; color: #666; }
            .date-field { color: #999; font-size: 12px; margin-top: 5px; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="logo">🔨 GK BUILDERS</div>
            <div class="subtitle">Civil Contractor - Rishikesh, Uttarakhand</div>
            <div style="margin-top: 10px; font-size: 14px; color: #666;">
              Phone: 9675429092 | Email: Gautam121095@Gmail.com
            </div>
          </div>

          <h2 style="text-align: center; color: #1F2937; margin-bottom: 25px;">SERVICE CONTRACT FORM</h2>

          <div class="section">
            <div class="section-title">CLIENT DETAILS</div>
            <div class="form-row">
              <div class="form-field">
                <label>Full Name *</label>
                <div style="padding: 8px; border: 1px solid #ddd; border-radius: 4px; background: #f9f9f9;">${formData.clientName || '___________________________'}</div>
              </div>
              <div class="form-field">
                <label>Phone Number *</label>
                <div style="padding: 8px; border: 1px solid #ddd; border-radius: 4px; background: #f9f9f9;">${formData.clientPhone || '___________________________'}</div>
              </div>
            </div>
            <div class="form-row">
              <div class="form-field">
                <label>Email Address *</label>
                <div style="padding: 8px; border: 1px solid #ddd; border-radius: 4px; background: #f9f9f9;">${formData.clientEmail || '___________________________'}</div>
              </div>
              <div class="form-field">
                <label>Site Address *</label>
                <div style="padding: 8px; border: 1px solid #ddd; border-radius: 4px; background: #f9f9f9;">${formData.siteAddress || '___________________________'}</div>
              </div>
            </div>
          </div>

          <div class="section">
            <div class="section-title">PROJECT DETAILS</div>
            <div class="form-row">
              <div class="form-field">
                <label>Service Type *</label>
                <div style="padding: 8px; border: 1px solid #ddd; border-radius: 4px; background: #f9f9f9;">${formData.projectType}</div>
              </div>
              <div class="form-field">
                <label>Estimated Budget *</label>
                <div style="padding: 8px; border: 1px solid #ddd; border-radius: 4px; background: #f9f9f9;">₹ ${formData.estimatedBudget || '___________________________'}</div>
              </div>
            </div>
            <div class="form-row">
              <div class="form-field">
                <label>Project Start Date *</label>
                <div style="padding: 8px; border: 1px solid #ddd; border-radius: 4px; background: #f9f9f9;">${formData.projectStartDate || '___________________________'}</div>
              </div>
            </div>
            <div class="form-row">
              <div class="form-field">
                <label>Project Description</label>
                <div style="padding: 8px; border: 1px solid #ddd; border-radius: 4px; background: #f9f9f9; min-height: 60px;">${formData.projectDescription || 'Not provided'}</div>
              </div>
            </div>
          </div>

          <div class="section">
            <div class="section-title">TERMS & CONDITIONS</div>
            <div class="checkbox-section">
              <strong>Payment Schedule:</strong> Payment will be made as per the agreed schedule (advance, during construction, and final payment).
            </div>
            <div class="checkbox-section">
              <strong>Material Quality:</strong> All materials used will be of premium quality as per specifications discussed.
            </div>
            <div class="checkbox-section">
              <strong>Project Timeline:</strong> The project will be completed within the agreed timeline. Any delays due to unforeseen circumstances will be communicated in advance.
            </div>
            <div class="checkbox-section">
              <strong>Site Access:</strong> The client must provide unrestricted access to the site during working hours.
            </div>
            <div class="checkbox-section">
              <strong>Design Changes:</strong> Any changes to the design or scope must be approved in writing and may incur additional costs.
            </div>
          </div>

          <div class="section">
            <div class="section-title">AGREEMENT</div>
            <div style="margin: 15px 0;">
              <p>☐ I agree to the service terms of GK Builders</p>
              <p>☐ I have read and agree to the GK Builders Service Terms</p>
            </div>
          </div>

          <div class="footer">
            <p><strong>Generated by GK Builders</strong></p>
            <p>This is a preliminary form. Please review and sign before submission.</p>
            <p>For more information, contact: 9675429092 or Gautam121095@Gmail.com</p>
            <div class="date-field">Generated on: ${new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
          </div>
        </body>
        </html>
      `;

      // Use the manus-md-to-pdf utility to convert HTML to PDF
      // For now, we'll create a simple download using browser's print-to-PDF
      const element = document.createElement('div');
      element.innerHTML = htmlContent;
      
      // Create a blob and download
      const blob = new Blob([htmlContent], { type: 'text/html' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `GK_Builders_Service_Contract_${new Date().getTime()}.html`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast.success('Form downloaded! You can print it as PDF from your browser.');
    } catch (error) {
      console.error('Error downloading PDF:', error);
      toast.error('Failed to download form. Please try again.');
    } finally {
      setIsDownloadingPDF(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

      // Validation
    if (!formData.clientName || !formData.clientPhone || !formData.clientEmail) {
      toast.error(t('validation.fillRequired'));
      return;
    }

    if (!formData.agreedToTerms) {
      toast.error(t('validation.agreeTerms'));
      return;
    }

    if (!formData.termsAgreed) {
      toast.error(t('validation.readTerms'));
      return;
    }

    setIsSubmitting(true);

    try {
      const projectStartDate = new Date(formData.projectStartDate);
      if (isNaN(projectStartDate.getTime())) {
        toast.error(t('validation.validDate'));
        setIsSubmitting(false);
        return;
      }

      await submitContractMutation.mutateAsync({
        clientName: formData.clientName,
        clientPhone: formData.clientPhone,
        clientEmail: formData.clientEmail,
        siteAddress: formData.siteAddress,
        projectType: formData.projectType,
        projectDescription: formData.projectDescription,
        estimatedBudget: formData.estimatedBudget,
        projectStartDate,
        agreedToTerms: formData.agreedToTerms,
      });

      toast.success(t('validation.submitSuccess'));
      setSubmitSuccess(true);

      // Reset form
      setFormData({
        clientName: "",
        clientPhone: "",
        clientEmail: "",
        siteAddress: "",
        projectType: "New Construction",
        projectDescription: "",
        estimatedBudget: "",
        projectStartDate: "",
        agreedToTerms: false,
        termsAgreed: false,
      });

      // Hide success message after 5 seconds
      setTimeout(() => setSubmitSuccess(false), 5000);
    } catch (error) {
      console.error("Error submitting contract:", error);
      toast.error(t('validation.submitError'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-20 bg-gray-50">
      <div className="container max-w-4xl">
        {/* Header with Language Toggle */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-between mb-6">
            <div></div>
            <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setLanguage('en')}
                className={`px-4 py-2 rounded font-semibold transition-all ${
                  language === 'en'
                    ? 'bg-primary text-white'
                    : 'text-foreground hover:bg-gray-200'
                }`}
              >
                English
              </button>
              <button
                onClick={() => setLanguage('hi')}
                className={`px-4 py-2 rounded font-semibold transition-all ${
                  language === 'hi'
                    ? 'bg-primary text-white'
                    : 'text-foreground hover:bg-gray-200'
                }`}
              >
                हिंदी
              </button>
            </div>
            <Globe className="w-6 h-6 text-primary" />
          </div>
          <div className="flex items-center justify-center gap-3 mb-4">
            <FileText className="w-8 h-8 text-primary" />
            <h2 className="text-4xl font-bold text-foreground">{t('form.title')}</h2>
          </div>
          <p className="text-lg text-muted-foreground">
            {t('form.subtitle')}
          </p>
        </div>

        {/* Success Message */}
        {submitSuccess && (
          <div className="mb-8 p-6 bg-green-50 border-2 border-green-500 rounded-lg flex items-start gap-4">
            <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-green-900 mb-2 text-lg">✓ {t('success.title')}</h3>
              <p className="text-green-800 font-semibold mb-2">
                {t('success.message')}
              </p>
              <p className="text-green-700 text-sm">
                {t('success.details')}
              </p>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-8 border-t-4 border-primary">
          {/* Client Details Section */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-foreground mb-6 pb-3 border-b-2 border-primary">
              {t('form.clientDetails')}
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              {/* Name */}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  {t('form.fullName')} *
                </label>
                <input
                  type="text"
                  name="clientName"
                  value={formData.clientName}
                  onChange={handleChange}
                  placeholder={t('form.placeholder.name')}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-primary transition-colors"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  {t('form.phoneNumber')} *
                </label>
                <input
                  type="tel"
                  name="clientPhone"
                  value={formData.clientPhone}
                  onChange={handleChange}
                  placeholder={t('form.placeholder.phone')}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-primary transition-colors"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  {t('form.emailAddress')} *
                </label>
                <input
                  type="email"
                  name="clientEmail"
                  value={formData.clientEmail}
                  onChange={handleChange}
                  placeholder={t('form.placeholder.email')}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-primary transition-colors"
                />
              </div>

              {/* Site Address */}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  {t('form.siteAddress')} *
                </label>
                <input
                  type="text"
                  name="siteAddress"
                  value={formData.siteAddress}
                  onChange={handleChange}
                  placeholder={t('form.placeholder.address')}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-primary transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Project Details Section */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-foreground mb-6 pb-3 border-b-2 border-primary">
              {t('form.projectDetails')}
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
               {/* Service Type */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                {t('form.serviceType')} *
              </label>/label>
                <select
                  name="projectType"
                  value={formData.projectType}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-primary transition-colors bg-white"
                >
                  <option value="New Construction">New Construction</option>
                  <option value="Renovation">Renovation</option>
                  <option value="Material Supply">Material Supply</option>
                </select>
              </div>

            {/* Estimated Budget */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                {t('form.estimatedBudget')} *
              </label>
                <input
                  type="text"
                  name="estimatedBudget"
                  value={formData.estimatedBudget}
                  onChange={handleChange}
                  placeholder="e.g., 500000"
                  required
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-primary transition-colors"
                />
              </div>

            {/* Project Start Date */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                {t('form.projectStartDate')} *
              </label>
                <input
                  type="date"
                  name="projectStartDate"
                  value={formData.projectStartDate}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-primary transition-colors"
                />
              </div>
            </div>

                 {/* Project Description */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                {t('form.projectDescription')}
              </label>
              <textarea
                name="projectDescription"
                value={formData.projectDescription}
                onChange={handleChange}
                placeholder={t('form.placeholder.description')}r project in detail..."
                rows={4}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-primary transition-colors resize-none"
              ></textarea>
            </div>
          </div>

          {/* Terms and Conditions Details Section */}
          <div className="mb-8 p-6 bg-white rounded-lg border-2 border-gray-300">
            <h3 className="text-xl font-bold text-foreground mb-6 pb-3 border-b-2 border-primary">
              GK Builders Service Terms & Conditions
            </h3>
            <div className="space-y-4 mb-6">
              {/* Payment Schedule */}
              <div className="flex gap-4">
                <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white text-sm font-bold">1</span>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-1">Payment Schedule</h4>
                  <p className="text-sm text-muted-foreground">
                    Payment shall be made as follows: 50% advance upon contract signing, 40% upon project completion, and 10% upon final inspection and approval. All payments must be made via bank transfer or cheque to GK Builders.
                  </p>
                </div>
              </div>

              {/* Material Quality */}
              <div className="flex gap-4">
                <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white text-sm font-bold">2</span>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-1">Material Quality</h4>
                  <p className="text-sm text-muted-foreground">
                    GK Builders commits to using only premium quality materials as per industry standards. All materials will be sourced from authorized suppliers and will include proper warranties. The client has the right to inspect all materials before installation.
                  </p>
                </div>
              </div>

              {/* Project Timeline */}
              <div className="flex gap-4">
                <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white text-sm font-bold">3</span>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-1">Project Timeline</h4>
                  <p className="text-sm text-muted-foreground">
                    The project timeline mentioned in this contract is an estimate. GK Builders will make reasonable efforts to complete the project on schedule. However, delays due to weather, unforeseen circumstances, or client-requested changes may extend the timeline. The client will be notified of any delays in advance.
                  </p>
                </div>
              </div>

              {/* Site Access Requirements */}
              <div className="flex gap-4">
                <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white text-sm font-bold">4</span>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-1">Site Access Requirements</h4>
                  <p className="text-sm text-muted-foreground">
                    The client must provide safe and unobstructed access to the project site during working hours (8:00 AM - 6:00 PM). GK Builders is not responsible for any damage to existing structures or belongings on the site. The client must ensure proper site security after working hours.
                  </p>
                </div>
              </div>

              {/* Design Changes */}
              <div className="flex gap-4">
                <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white text-sm font-bold">5</span>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-1">Design Changes</h4>
                  <p className="text-sm text-muted-foreground">
                    Any changes to the original design or scope of work must be approved in writing by both parties. Design changes may result in additional costs and timeline extensions. GK Builders will provide a revised quote for any approved changes within 48 hours of the request.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Terms & Conditions Section */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-foreground mb-6 pb-3 border-b-2 border-primary">
              {t('form.termsConditions')}
            </h3>
            
            {/* Terms Display */}
            <div className="mb-6 p-6 bg-gray-50 rounded-lg border-2 border-gray-200 max-h-64 overflow-y-auto">
              <div className="space-y-3 text-sm text-foreground">
                <p>✓ {t('terms.paymentSchedule')}</p>
                <p>✓ {t('terms.materialQuality')}</p>
                <p>✓ {t('terms.projectTimeline')}</p>
                <p>✓ {t('terms.siteAccess')}</p>
                <p>✓ {t('terms.designChanges')}</p>
              </div>
            </div>

            {/* Checkboxes */}
            <div className="space-y-4">
              {/* First Checkbox - Service Terms */}
              <div className="p-6 bg-gray-50 rounded-lg border-2 border-gray-200">
                <label className="flex items-start gap-4 cursor-pointer">
                  <input
                    type="checkbox"
                    name="agreedToTerms"
                    checked={formData.agreedToTerms}
                    onChange={handleChange}
                    className="w-5 h-5 mt-1 accent-primary rounded border-2 border-gray-300"
                  />
                  <span className="text-sm text-foreground">
                    <span className="font-semibold">{t('form.agreeToTerms')} *</span>
                    <br />
                    <span className="text-muted-foreground">
                      {t('form.agreeToTermsDesc')}
                    </span>
                  </span>
                </label>
              </div>

              {/* Second Checkbox - Terms Agreement */}
              <div className="p-6 bg-red-50 rounded-lg border-2 border-red-300">
                <label className="flex items-start gap-4 cursor-pointer">
                  <input
                    type="checkbox"
                    name="termsAgreed"
                    checked={formData.termsAgreed}
                    onChange={handleChange}
                    className="w-5 h-5 mt-1 accent-primary rounded border-2 border-gray-300"
                    required
                  />
                  <span className="text-sm text-foreground">
                    <span className="font-semibold text-red-900">{t('form.readAndAgree')} *</span>
                    <br />
                    <span className="text-red-800">
                      {t('form.readAndAgreeDesc')}
                    </span>
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col md:flex-row gap-4">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-primary hover:bg-primary/90 text-white font-bold py-3 rounded-lg transition-all"
            >
              {isSubmitting ? (language === 'en' ? "Submitting..." : "जमा किया जा रहा है...") : t('form.submit')}
            </Button>
            <Button
              type="button"
              variant="outline"
              disabled={isDownloadingPDF}
              onClick={handleDownloadPDF}
              className="flex-1 border-2 border-primary text-primary hover:bg-primary/10 font-bold py-3 rounded-lg transition-all flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              {isDownloadingPDF ? (language === 'en' ? "Downloading..." : "डाउनलोड किया जा रहा है...") : t('form.download')}
            </Button>
            <Button
              type="reset"
              variant="outline"
              className="flex-1 border-2 border-gray-300 text-foreground hover:bg-gray-100 font-bold py-3 rounded-lg transition-all"
              onClick={() => {
                setFormData({
                  clientName: "",
                  clientPhone: "",
                  clientEmail: "",
                  siteAddress: "",
                  projectType: "New Construction",
                  projectDescription: "",
                  estimatedBudget: "",
                  projectStartDate: "",
                  agreedToTerms: false,
                  termsAgreed: false,
                });
              }}
            >
              {t('form.clear')}
            </Button>
          </div>

          {/* Footer Note */}
          <div className="mt-8 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
            <p className="text-sm text-blue-900">
              <span className="font-semibold">{language === 'en' ? 'Note:' : 'नोट:'}  </span> {t('form.required')}
            </p>
          </div>
        </form>
      </div>
    </section>
  );
}

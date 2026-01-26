import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Scale, Shield, Cookie } from 'lucide-react';

const Legal = () => {
    const location = useLocation();

    useEffect(() => {
        if (location.hash) {
            const element = document.querySelector(location.hash);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            }
        }
    }, [location]);

    return (
        <div className="max-w-4xl mx-auto">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-16"
            >
                <h1 className="text-5xl font-bold mb-4">Legal Information</h1>
                <p className="text-gray-400">Last Updated: January 25, 2024</p>
            </motion.div>

            {/* Terms of Service */}
            <section id="terms" className="mb-20 scroll-mt-24">
                <div className="flex items-center gap-3 mb-6">
                    <Scale className="w-8 h-8 text-blue-500" />
                    <h2 className="text-3xl font-bold">Terms of Service</h2>
                </div>

                <div className="space-y-6 text-gray-300 leading-relaxed">
                    <h3 className="text-xl font-semibold text-white mt-8">1. Acceptance of Terms</h3>
                    <p>
                        By accessing and using Headhunt ("the Service"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
                    </p>

                    <h3 className="text-xl font-semibold text-white mt-8">2. Use License</h3>
                    <p>
                        Permission is granted to temporarily access the materials (information or software) on Headhunt's platform for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
                    </p>
                    <ul className="list-disc list-inside ml-4 space-y-2">
                        <li>Modify or copy the materials;</li>
                        <li>Use the materials for any commercial purpose, or for any public display (commercial or non-commercial);</li>
                        <li>Attempt to decompile or reverse engineer any software contained on Headhunt's platform;</li>
                        <li>Remove any copyright or other proprietary notations from the materials; or</li>
                        <li>Transfer the materials to another person or "mirror" the materials on any other server.</li>
                    </ul>

                    <h3 className="text-xl font-semibold text-white mt-8">3. Disclaimer</h3>
                    <p>
                        The materials on Headhunt's platform are provided on an 'as is' basis. Headhunt makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
                    </p>

                    <h3 className="text-xl font-semibold text-white mt-8">4. Limitations</h3>
                    <p>
                        In no event shall Headhunt or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on Headhunt's platform, even if Headhunt or a Headhunt authorized representative has been notified orally or in writing of the possibility of such damage. Because some jurisdictions do not allow limitations on implied warranties, or limitations of liability for consequential or incidental damages, these limitations may not apply to you.
                    </p>

                    <h3 className="text-xl font-semibold text-white mt-8">5. Accuracy of Materials</h3>
                    <p>
                        The materials appearing on Headhunt's platform could include technical, typographical, or photographic errors. Headhunt does not warrant that any of the materials on its platform are accurate, complete or current. Headhunt may make changes to the materials contained on its platform at any time without notice. However, Headhunt does not make any commitment to update the materials.
                    </p>

                    <h3 className="text-xl font-semibold text-white mt-8">6. Links</h3>
                    <p>
                        Headhunt has not reviewed all of the sites linked to its platform and is not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by Headhunt of the site. Use of any such linked website is at the user's own risk.
                    </p>

                    <h3 className="text-xl font-semibold text-white mt-8">7. Modifications</h3>
                    <p>
                        Headhunt may revise these terms of service for its platform at any time without notice. By using this platform you are agreeing to be bound by the then current version of these terms of service.
                    </p>

                    <h3 className="text-xl font-semibold text-white mt-8">8. Governing Law</h3>
                    <p>
                        These terms and conditions are governed by and construed in accordance with the laws of the United States and you irrevocably submit to the exclusive jurisdiction of the courts in that location.
                    </p>
                </div>
            </section>

            {/* Privacy Policy */}
            <section id="privacy" className="mb-20 scroll-mt-24">
                <div className="flex items-center gap-3 mb-6">
                    <Shield className="w-8 h-8 text-green-500" />
                    <h2 className="text-3xl font-bold">Privacy Policy</h2>
                </div>

                <div className="space-y-6 text-gray-300 leading-relaxed">
                    <p>
                        Your privacy is important to us. It is Headhunt's policy to respect your privacy regarding any information we may collect from you across our website.
                    </p>

                    <h3 className="text-xl font-semibold text-white mt-8">1. Information We Collect</h3>
                    <p>
                        We only collect information about you if we have a reason to do so—for example, to provide our Services, to communicate with you, or to make our Services better. We collect information in three ways: if and when you provide information to us, automatically through operating our Services, and from outside sources.
                    </p>

                    <h3 className="text-xl font-semibold text-white mt-8">2. How We Use Information</h3>
                    <p>
                        We use the information we collect in various ways, including to:
                    </p>
                    <ul className="list-disc list-inside ml-4 space-y-2">
                        <li>Provide, operate, and maintain our platform</li>
                        <li>Improve, personalize, and expand our platform</li>
                        <li>Understand and analyze how you use our platform</li>
                        <li>Develop new products, services, features, and functionality</li>
                        <li>Communicate with you for customer service, updates, and marketing purposes</li>
                        <li>Process your transactions and manage your orders</li>
                        <li>Find and prevent fraud</li>
                    </ul>

                    <h3 className="text-xl font-semibold text-white mt-8">3. Data Retention</h3>
                    <p>
                        We will retain your information for as long as your account is active or as needed to provide you services. We will retain and use your information as necessary to comply with our legal obligations, resolve disputes, and enforce our agreements.
                    </p>

                    <h3 className="text-xl font-semibold text-white mt-8">4. Security</h3>
                    <p>
                        The security of your personal information is important to us, but remember that no method of transmission over the Internet, or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your personal information, we cannot guarantee its absolute security.
                    </p>

                    <h3 className="text-xl font-semibold text-white mt-8">5. Third-Party Services</h3>
                    <p>
                        We may employ third-party companies and individuals to facilitate our Service, provide the Service on our behalf, perform Service-related services, or assist us in analyzing how our Service is used. These third parties have access to your personal information only to perform these tasks on our behalf and are obligated not to disclose or use it for any other purpose.
                    </p>

                    <h3 className="text-xl font-semibold text-white mt-8">6. Your Rights</h3>
                    <p>
                        You have the right to access, update, or delete the information we have on you. Whenever made possible, you can access, update, or request deletion of your personal information directly within your account settings section. If you are unable to perform these actions yourself, please contact us to assist you.
                    </p>

                    <h3 className="text-xl font-semibold text-white mt-8">7. Children's Privacy</h3>
                    <p>
                        Our Service does not address anyone under the age of 13. We do not knowingly collect personally identifiable information from children under 13. If you are a parent or guardian and you are aware that your child has provided us with personal information, please contact us.
                    </p>

                    <h3 className="text-xl font-semibold text-white mt-8">8. Changes to This Privacy Policy</h3>
                    <p>
                        We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date at the top of this Privacy Policy.
                    </p>
                </div>
            </section>

            {/* Cookie Policy */}
            <section id="cookies" className="mb-20 scroll-mt-24">
                <div className="flex items-center gap-3 mb-6">
                    <Cookie className="w-8 h-8 text-purple-500" />
                    <h2 className="text-3xl font-bold">Cookie Policy</h2>
                </div>

                <div className="space-y-6 text-gray-300 leading-relaxed">
                    <p>
                        This Cookie Policy explains how Headhunt uses cookies and similar technologies to recognize you when you visit our platform. It explains what these technologies are and why we use them, as well as your rights to control our use of them.
                    </p>

                    <h3 className="text-xl font-semibold text-white mt-8">1. What Are Cookies?</h3>
                    <p>
                        Cookies are small data files that are placed on your computer or mobile device when you visit a website. Cookies are widely used by website owners in order to make their websites work, or to work more efficiently, as well as to provide reporting information.
                    </p>

                    <h3 className="text-xl font-semibold text-white mt-8">2. Why Do We Use Cookies?</h3>
                    <p>
                        We use first-party and third-party cookies for several reasons. Some cookies are required for technical reasons in order for our platform to operate, and we refer to these as "essential" or "strictly necessary" cookies. Other cookies enable us to track and target the interests of our users to enhance the experience on our platform.
                    </p>

                    <h3 className="text-xl font-semibold text-white mt-8">3. Types of Cookies We Use</h3>
                    <ul className="list-disc list-inside ml-4 space-y-2">
                        <li><strong>Essential Cookies:</strong> These cookies are strictly necessary to provide you with services available through our platform and to use some of its features.</li>
                        <li><strong>Performance and Functionality Cookies:</strong> These cookies are used to enhance the performance and functionality of our platform but are non-essential to their use.</li>
                        <li><strong>Analytics and Customization Cookies:</strong> These cookies collect information that is used either in aggregate form to help us understand how our platform is being used or how effective our marketing campaigns are.</li>
                        <li><strong>Advertising Cookies:</strong> These cookies are used to make advertising messages more relevant to you and your interests.</li>
                    </ul>

                    <h3 className="text-xl font-semibold text-white mt-8">4. How Can You Control Cookies?</h3>
                    <p>
                        You have the right to decide whether to accept or reject cookies. You can exercise your cookie preferences by clicking on the appropriate opt-out links provided in the cookie banner or by setting or amending your web browser controls to accept or refuse cookies.
                    </p>

                    <h3 className="text-xl font-semibold text-white mt-8">5. Updates to This Cookie Policy</h3>
                    <p>
                        We may update this Cookie Policy from time to time in order to reflect changes to the cookies we use or for other operational, legal, or regulatory reasons. Please therefore revisit this Cookie Policy regularly to stay informed about our use of cookies and related technologies.
                    </p>
                </div>
            </section>

            {/* Contact Information */}
            <section className="mb-20 bg-white/5 border border-white/10 rounded-2xl p-8">
                <h2 className="text-2xl font-bold mb-4">Contact Us</h2>
                <p className="text-gray-300">
                    If you have any questions about these legal terms, please contact us at:
                </p>
                <p className="text-gray-300 mt-4">
                    <strong>Email:</strong> legal@headhunt.com<br />
                    <strong>Phone:</strong> +1 (555) 012-3456
                </p>
            </section>
        </div>
    );
};

export default Legal;
